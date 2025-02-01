import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'; // Importa nodemailer
import { randomInt } from 'crypto';
import * as crypto from 'crypto'; // Para el hash MD5
import * as moment from 'moment'
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecoverPasswordService {
    private verificationCodes: Map<string, { code: string; expiresAt: moment.Moment }> = new Map();

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, // Inyecta el repositorio de User
    ) { }

    // Configura el transporte de nodemailer
    private transporter = nodemailer.createTransport({
        service: 'gmail', // Cambia el servicio según tu proveedor de correo
        auth: {
            user: "tallermecanicoheber@gmail.com", // Tu correo
            pass: "l e d e q s p o b k f s w a u f", // Contraseña o token de aplicación
        },
    });

    async sendVerificationCode(correo: string): Promise<string> {
        console.log('Correo recibido', correo);
        //Verificar que el correo no este vacio
        /*if(!correo || typeof correo !== 'string' || correo.trim() === ''){
            throw new Error('El correo proporcionado no es valido puto');
        }*/

        //Buscar al usuario por su correo en la base de datos
        const user = await this.userRepository.findOne({ where: { correo } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        //Generar un nuevo codigo de verificacion
        const verificationCode = randomInt(100000, 999999).toString();

        //Establecer la expiracion del codigo(10 minutos)
        const expiresAt = moment().add(10, 'minutes');

        //Almacenar el codigo y su fecha de expiracion en memoria
        this.verificationCodes.set(correo, { code: verificationCode, expiresAt });

        //Enviar el correo
        await this.transporter.sendMail({
            from: 'tallermecanicoheber@gmail.com', // El remitente
            to: correo.trim(), // El correo del destinatario
            subject: 'Código de verificación para recuperar tu contraseña',
            text: `Tu código de verificación es: ${verificationCode}. Este código expira en 10 minutos.`,
        });
        return 'Correo con codigo de verifiacion enviado';
    }

    async verifyCode(email: string, code: string): Promise<string> {
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
        //Buscar al usuario por su correo en la base de datos
        const user = await this.userRepository.findOne({ where: { correo } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Encriptar la nueva contraseña con MD5
        const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

        // Actualizar la contraseña en la base de datos
        user.contrasena = hashedPassword;
        await this.userRepository.save(user);

        return 'Contraseña actualizada exitosamente';

    }
}
