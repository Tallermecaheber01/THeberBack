import * as admin from 'firebase-admin';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartwatchLinkEntity } from './smartwatch-link.entity';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { randomBytes } from 'crypto';
import { PushService } from 'src/push/push.service'; 

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private firebaseAvailable = false;

  constructor(
    @InjectRepository(SmartwatchLinkEntity)
    private readonly linkRepository: Repository<SmartwatchLinkEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly pushService: PushService,
  ) {
    try {
      if (!admin.apps.length) {
        // Verifica si el archivo local existe
        const firebasePath = 'C:/Users/yoloa/THeberBack-main/src/client/smartwatch/keys/tallerheber-16566-firebase-adminsdk-fbsvc-9dea63d6f1.json';
        if (require('fs').existsSync(firebasePath)) {
          admin.initializeApp({
            credential: admin.credential.cert(firebasePath),
          });
          this.firebaseAvailable = true;
          this.logger.log('Firebase Admin inicializado');
        } else {
          this.logger.warn('Firebase Admin no disponible, continuar sin FCM');
        }
      }
    } catch (err) {
      this.logger.error('Error inicializando Firebase: ' + err.message);
    }
  }

  async sendNotificationToSmartwatch(payload: {
    title: string;
    message: string;
    citaId: number;
    tipo: 'aceptada' | 'rechazada' | 'cancelada' | 'proxima' | 'finalizada';
    token: string;
  }): Promise<void> {

    // 🚀 Enviar notificación Firebase solo si está disponible
    if (this.firebaseAvailable) {
      const message: admin.messaging.Message = {
        token: payload.token,
        data: {
          title: payload.title,
          subtitle: payload.message,
          citaId: payload.citaId.toString(),
          tipo: payload.tipo,
        },
        android: { priority: 'high' },
      };

      try {
        const response = await admin.messaging().send(message);
        this.logger.log('✅ Notificación FCM enviada: ' + response);
      } catch (error) {
        this.logger.error('❌ Error al enviar FCM: ' + error.message);
      }
    }

    // 🚀 Enviar también notificación web push
    try {
      await this.pushService.sendNotification(payload.title, payload.message);
      this.logger.log('✅ Notificación web push enviada');
    } catch (error) {
      this.logger.error('❌ Error enviando push web: ' + error.message);
    }
  }

  async generarCodigoSmartwatch(user: ClientEntity): Promise<string> {
    const code = randomBytes(3).toString('hex');
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    const nuevo = this.linkRepository.create({
      user,
      code,
      used: false,
      expiresAt,
    });
    await this.linkRepository.save(nuevo);
    return code;
  }

  async linkSmartwatch(code: string, fcmToken: string): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { code },
      relations: ['user'],
    });
    if (!link) {
      this.logger.warn(`Código no encontrado: ${code}`);
      throw new BadRequestException('Código inválido');
    }
    if (link.used) {
      this.logger.warn(`Código ya usado: ${code}`);
      throw new BadRequestException('Código ya usado');
    }
    const ahora = new Date();
    if (link.expiresAt < ahora) {
      this.logger.warn(`Código expirado: ${code}`);
      throw new BadRequestException('Código expirado');
    }

    link.used = true;
    await this.linkRepository.save(link);

    const cliente = link.user;
    cliente.fcm_token = fcmToken;
    await this.clientRepository.save(cliente);

    this.logger.log(`Vinculación exitosa. FCM Token recibido: ${fcmToken}`);
  }

  async unlinkSmartwatchByToken(token: string): Promise<void> {
    const cliente = await this.clientRepository.findOne({ where: { fcm_token: token } });
    if (!cliente) {
      this.logger.warn(`Intento de desvincular: token no encontrado: ${token}`);
      throw new BadRequestException('Token no válido o no vinculado');
    }

    cliente.fcm_token = null;
    await this.clientRepository.save(cliente);
    this.logger.log(`Desvinculación exitosa de cliente ID ${cliente.id}, token: ${token}`);

    await this.linkRepository.delete({ user: cliente });
    this.logger.log(`Registros de enlace eliminados para cliente ID ${cliente.id}`);
  }
}
