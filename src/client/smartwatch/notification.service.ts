import * as admin from 'firebase-admin';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartwatchLinkEntity } from './smartwatch-link.entity';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { randomBytes } from 'crypto';
import { PushService } from 'src/push/push.service'; // 👈 importa tu servicio push

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(SmartwatchLinkEntity)
    private readonly linkRepository: Repository<SmartwatchLinkEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly pushService: PushService, // 👈 inyecta aquí
  ) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          'C:/Users/yoloa/THeberBack-main/src/client/smartwatch/keys/tallerheber-16566-firebase-adminsdk-fbsvc-9dea63d6f1.json',
        ),
      });
    }
  }

  async sendNotificationToSmartwatch(payload: {
    title: string;
    message: string;
    citaId: number;
    tipo: 'aceptada' | 'rechazada' | 'cancelada' | 'proxima' | 'finalizada';
    token: string;
  }): Promise<void> {
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

    this.logger.log('📤 Enviando notificación Firebase...');
    try {
      const response = await admin.messaging().send(message);
      this.logger.log('✅ Notificación FCM enviada: ' + response);
    } catch (error) {
      this.logger.error('❌ Error al enviar FCM: ' + error.message);
    }

    // 🚀 Enviar también notificación web push
    try {
      this.logger.log('🌐 Enviando notificación web push...');
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

    // Marcar como usado
    link.used = true;
    await this.linkRepository.save(link);

    // Actualizar fcm_token del cliente asociado
    const cliente = link.user;
    cliente.fcm_token = fcmToken;
    await this.clientRepository.save(cliente);

    this.logger.log(`Vinculación exitosa. FCM Token recibido: ${fcmToken}`);
  }

  // para desvincular: borrar el fcm token del cliente
      async unlinkSmartwatchByToken(token: string): Promise<void> {
    // Buscar el cliente que tiene este token
    const cliente = await this.clientRepository.findOne({ where: { fcm_token: token } });
    if (!cliente) {
      this.logger.warn(`Intento de desvincular: token no encontrado: ${token}`);
      throw new BadRequestException('Token no válido o no vinculado');
    }
    // Limpiar el fcm_token
    cliente.fcm_token = null;
    await this.clientRepository.save(cliente);
    this.logger.log(`Desvinculación exitosa de cliente ID ${cliente.id}, token: ${token}`);

    // Opcional: eliminar registros en SmartwatchLinkEntity de ese usuario
    await this.linkRepository.delete({ user: cliente });
    this.logger.log(`Registros de enlace eliminados para cliente ID ${cliente.id}`);
  }


}



