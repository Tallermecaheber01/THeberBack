import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedPersonnelEntity } from './entity/authorized-personnel-entity';
import { ClientEntity } from './entity/client-entity';
import { Repository } from 'typeorm';
import { UserViewEntity } from './view/vw-users-entity';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import * as moment from 'moment'
import * as bcrypt from 'bcrypt'

@Injectable()
export class RecoverPasswordService {
    private verificationCodes: Map<string, { code: string; expiresAt: moment.Moment }> = new Map();

    constructor(
        @InjectRepository(AuthorizedPersonnelEntity)
        private readonly authorizedPersonnelRepository: Repository<AuthorizedPersonnelEntity>,

        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,

        @InjectRepository(UserViewEntity)
        private readonly userRepository: Repository<UserViewEntity>,
    ) { }

    // Configura el transporte de nodemailer
    private transporter = nodemailer.createTransport({
        service: 'gmail', // Cambia el servicio según tu proveedor de correo
        auth: {
            user: "tallermecanicoheber@gmail.com", // Tu correo
            pass: "l e d e q s p o b k f s w a u f", // Contraseña o token de aplicación
        },
    });


    async findUserByEmail(correo: string) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.correo', 'user.preguntaSecreta'])
            .where('user.correo = :correo', { correo })  // 👈 Parametrización segura
            .getRawOne(); // 👈 Devuelve un solo resultado

        if (!user) {
            return { success: false };
        }

        return { success: true, securityQuestion: user.preguntaSecreta };
    }






    async sendPasswordResetVerificationCode(
        correo: string,
        idPreguntaSecreta: number,
        respuestaSecreta: string
    ): Promise<string> {

        // Buscar al usuario por correo, idPreguntaSecreta y respuestaSecreta
        const user = await this.userRepository.findOne({
            where: { correo, idPreguntaSecreta }
        });

        if (!user) {
            throw new Error('Datos incorrectos. Verifica tu correo, pregunta secreta y respuesta.');
        }

        //Verificar si la respuesta secreta es correcta
        const isMatch = await bcrypt.compare(respuestaSecreta, user.respuestaSecreta);
        if (!isMatch) {
            throw new Error('La respuesta secreta es incorrecta')
        }

        // Generar un nuevo código de verificación
        const verificationCode = randomInt(100000, 999999).toString();

        // Establecer la expiración del código (10 minutos)
        const expiresAt = moment().add(10, 'minutes');

        // Almacenar el código y su fecha de expiración en memoria
        this.verificationCodes.set(correo, { code: verificationCode, expiresAt });

        console.log(verificationCode);

        // Enviar el correo
        await this.transporter.sendMail({
            from: 'tallermecanicoheber@gmail.com', // Remitente
            to: correo.trim(), // Destinatario
            subject: 'Código de verificación para recuperar tu contraseña',
            html: `
                    <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de contraseña</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f7f7f7;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #0056b3;
                  border-radius: 8px;
                  background-color: #ffffff;
              }
              h2 {
                  color: #0056b3;
              }
              p {
                  color: #333;
              }
              .code {
                  color: #e0a800;
                  font-weight: bold;
                  font-size: 20px;
              }
              .image-container {
                  text-align: center;
                  margin-bottom: 20px;
              }
              img {
                  width: 250px;
                  height: auto;
                  max-width: 100%;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="image-container">
                  <img src="https://taller-backend-two.vercel.app/images/latest" alt="Logo" />
              </div>
              <h2>Recuperación de Contraseña</h2>
              <p>Hola,</p>
              <p>Tu código de recuperación es: <span class="code">${verificationCode}</span>.</p>
              <p>Este código expirará en 10 minutos.</p>
              <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>
          </div>
      </body>
      </html>
                `,
        });

        return 'Correo con código de recuperación enviado';
    }


    async verifyPasswordResetCode(email: string, code: string): Promise<string> {
        //verificar si el codigo es correcto o ya expiro
        const storedData = this.verificationCodes.get(email);
        if (!storedData) {
            throw new Error('No se encontró un código de verificación para este correo');
        }

        const { code: storedCode, expiresAt } = storedData;

        //verificar si el codigo ingresado es el mismo y si no ha expirado
        if (storedCode !== code) {
            throw new Error('Código de verificación incorrecto');
        }
        if (moment().isAfter(expiresAt)) {
            this.verificationCodes.delete(email); // Eliminar el código expirado
            throw new Error('El código de verificación ha expirado');
        }

        // El código es válido, eliminamos el código de la memoria
        this.verificationCodes.delete(email);

        return 'Código verificado correctamente';
    }

    async resetPassword(correo: string, newPassword: string): Promise<string> {
        // Buscar al usuario por su correo en la base de datos
        const user = await this.userRepository.findOne({ where: { correo } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Obtener el rol del usuario desde la vista de usuarios
        const userRole = user.rol; // Asegúrate de que el campo 'rol' esté disponible en la entidad 'UserViewEntity'

        // Encriptar la nueva contraseña con bcrypt
        const salt = await bcrypt.genSalt(10);  // Genera un "salt" de 10 rondas
        const hashedPassword = await bcrypt.hash(newPassword, salt);  // Encripta la nueva contraseña

        // Dependiendo del rol, actualizar la contraseña en la tabla correspondiente
        if (userRole === 'empleado' || userRole === 'admin') {
            const authorizedPersonnel = await this.authorizedPersonnelRepository.findOne({ where: { correo } });
            if (!authorizedPersonnel) {
                throw new Error('Empleado o administrador no encontrado');
            }
            authorizedPersonnel.contrasena = hashedPassword;
            await this.authorizedPersonnelRepository.save(authorizedPersonnel);
        } else if (userRole === 'cliente') {
            const client = await this.clientRepository.findOne({ where: { correo } });
            if (!client) {
                throw new Error('Cliente no encontrado');
            }
            client.contrasena = hashedPassword;
            await this.clientRepository.save(client);
        } else {
            throw new Error('Rol de usuario no válido');
        }

        return 'Contraseña actualizada exitosamente';
    }
}
