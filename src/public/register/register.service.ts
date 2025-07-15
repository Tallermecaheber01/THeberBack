import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../recover-password/entity/client-entity';
import { UserViewEntity } from './view/vw-users-entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';
import { CreateClientDto } from './dto/create-client-dto';
import { QuestionSecretEntity } from './entity/question-secret.entity';
import { LoggerService } from 'src/services/logger/logger.service';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class RegisterService {
    private verificationCodes: Map<string, { code: string; expiresAt: moment.Moment }> = new Map();
    constructor(
        @InjectRepository(ClientEntity)
        private clientRepository: Repository<ClientEntity>,

        @InjectRepository(UserViewEntity)
        private userViewRepository: Repository<UserViewEntity>,

        @InjectRepository(QuestionSecretEntity)
        private questionsRepository: Repository<QuestionSecretEntity>,


        private readonly logger : LoggerService,
    ) { }

      

    // Configura el transporte de nodemailer
    private transporter = nodemailer.createTransport({
        service: 'gmail', // Cambia el servicio según tu proveedor de correo
        auth: {
            user: "tallermecanicoheber@gmail.com", // Tu correo
            pass: "l e d e q s p o b k f s w a u f", // Contraseña o token de aplicación
        },
    });

    async getAllQuestions() {
        const questions = await this.questionsRepository.find({});
        return questions;
    }

    async sendVerificationCode(correo: string): Promise<string> {

        // Verificar que el correo no esté vacío
        if (!correo || typeof correo !== 'string' || correo.trim() === '') {
            //await this.saveLog('ERROR', 'Correo inválido', correo, 'El correo proporcionado no es válido');
            this.logger.error('Correo inválido', { correo, file: 'register.service.ts' });
            throw new Error('El correo proporcionado no es valido');
        }

        // Verificar si el correo ya está en uso en la base de datos
        const existingUser = await this.userViewRepository.findOne({ where: { correo } });
        if (existingUser) {
            //await this.saveLog('WARNING', 'Correo ya registrado', correo, 'El correo ya está registrado en la base de datos');
            this.logger.warn('Correo ya registrado', { correo, file: 'register.service.ts' });
            throw new Error('El correo ya está registrado en la base de datos');
        }


        // Generar un nuevo código de verificación
        const verificationCode = randomInt(100000, 999999).toString();

        // Establecer la expiración del código (10 minutos)
        const expiresAt = moment().add(10, 'minutes');

        // Almacenar el código y su fecha de expiración en memoria
        this.verificationCodes.set(correo, { code: verificationCode, expiresAt });

        // Enviar el correo
        await this.transporter.sendMail({
            from: 'tallermecanicoheber@gmail.com', // El remitente
            to: correo.trim(), // El correo del destinatario
            subject: 'Código de verificación para registrarte',
            html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Titulo del correo</title>
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
                        color: #e0a800; /* Color amarillo oscuro */
                        font-weight: bold;
                        font-size: 20px;
                    }
                    .image-container {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    img {
                        width: 150px;
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
                    <h2>Titulo</h2>
                    <p>Saludo</p>
                    <p>Tu código de registro es: <span class="code">${verificationCode}</span>.</p>
                    <p>Este código expirará en 10 minutos.</p>
                    <p>Despedida}</p>
                </div>
            </body>
            </html>
        `,
            //text: `Tu código de verificación es: ${verificationCode}. Este código expira en 10 minutos.`,
        });
        //await this.saveLog('INFO', 'Código de verificación enviado', correo, `Código: ${verificationCode}`);
        this.logger.log('Código de verificación enviado', { correo, verificationCode, file: 'register.service.ts' });
        return 'Correo con código de verificación enviado';
    }

    async verifyCode(correo: string, code: string): Promise<{ success: boolean; message: string }> {
        // Verificar si el código existe para el correo
        const storedData = this.verificationCodes.get(correo);
        if (!storedData) {
            //await this.saveLog('ERROR', 'Código no encontrado', correo, 'No se encontró un código de verificación para este correo');
            this.logger.error('Código no encontrado', { correo, file: 'register.service.ts' });
            return { success: false, message: 'No se encontró un código de verificación para este correo' };
        }

        const { code: storedCode, expiresAt } = storedData;

        // Verificar si el código ingresado es correcto
        if (storedCode !== code) {
            //await this.saveLog('WARNING', 'Código incorrecto', correo, `Código ingresado: ${code}`);
            this.logger.warn('Código incorrecto', { correo, code, file: 'register.service.ts' });
            return { success: false, message: 'Código de verificación incorrecto' };
        }

        // Verificar si el código ha expirado
        if (moment().isAfter(expiresAt)) {
            this.verificationCodes.delete(correo); // Eliminar el código expirado
            //await this.saveLog('ERROR', 'Código expirado', correo, `Código expirado: ${code}`);
            this.logger.error('Código expirado', { correo, code, file: 'register.service.ts' });
            return { success: false, message: 'El código de verificación ha expirado' };
        }

        // El código es válido, eliminamos el código de la memoria
        this.verificationCodes.delete(correo);
        //await this.saveLog('INFO', 'Código verificado', correo, `Código: ${code}`);
        this.logger.log('Código verificado correctamente', { correo, code, file: 'register.service.ts' });
        return { success: true, message: 'Código verificado correctamente' };
    }


    async createUser(userData: CreateClientDto): Promise<ClientEntity> {
        const { contrasena, respuestaSecreta } = userData;

        const isCompromised = await this.checkPasswordPwned(contrasena);
        if (isCompromised) {
            //await this.saveLog('ERROR', 'Contraseña comprometida', '', 'La contraseña ha sido comprometida en una brecha de seguridad');
            this.logger.error('Contraseña comprometida', { file: 'register.service.ts' });
            throw new Error('La contraseña ha sido comprometida en una brecha de seguridad. Por favor, elige otra.');
        }

        try {
            userData.contrasena = await this.encryptWithBcrypt(contrasena);
            userData.respuestaSecreta = await this.encryptWithBcrypt(respuestaSecreta);

            const newUser = this.clientRepository.create(userData);
            const savedUser = await this.clientRepository.save(newUser);

            //await this.saveLog('INFO', 'Usuario creado', '', `Usuario: ${savedUser.correo}`);
            this.logger.log('Usuario creado', { userId: savedUser.correo, file: 'register.service.ts' });
            return savedUser;
        } catch (error) {
            //await this.saveLog('ERROR', 'Error al crear usuario', '', error.message);
             this.logger.error('Error al crear usuario', { error: error.message, file: 'register.service.ts' });
            throw new Error('Hubo un error al crear el usuario');
        }
    }

    // Método para verificar si la contraseña ha sido comprometida usando la API PwnedPasswords
    private async checkPasswordPwned(password: string): Promise<boolean> {
        try {
            // Generar el hash SHA-1 de la contraseña
            const sha1Hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();

            // Obtener los primeros 5 caracteres del hash
            const hashPrefix = sha1Hash.slice(0, 5);

            // Obtener el sufijo del hash (los 35 caracteres restantes)
            const hashSuffix = sha1Hash.slice(5);

            // Realizar la solicitud a la API de PwnedPasswords
            const response = await axios.get(`https://api.pwnedpasswords.com/range/${hashPrefix}`, { timeout: 5000 });

            // Verificar si el sufijo está presente en la respuesta (lo que indica que la contraseña ha sido filtrada)
            const data = response.data;
            const regex = new RegExp(`^${hashSuffix}:`, 'm');
            return regex.test(data);
        } catch (error) {
            this.logger.error('Error al verificar la contraseña', { error: error.message, file: 'register.service.ts' });
            throw new Error('Hubo un error al verificar la contraseña. Intenta nuevamente.');
        }
    }

    //Metodo para encriptar con bcrypt
    private async encryptWithBcrypt(password: string): Promise<string> {
        const saltRounds = 10;  // Número de rondas de salting
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    ///tokens de smartwatch 

      async updateFcmToken(id: number, fcmToken: string): Promise<ClientEntity> {
        const client = await this.clientRepository.findOne({ where: { id } });
        if (!client) {
        throw new NotFoundException(`Cliente con id ${id} no encontrado`);
        }
        client.fcm_token = fcmToken;
        return this.clientRepository.save(client);
    }

    async findClientById(id: number): Promise<ClientEntity> {
        const client = await this.clientRepository.findOne({ where: { id } });
        if (!client) {
        throw new NotFoundException(`Cliente con id ${id} no encontrado`);
        }
        return client;
    }


}
