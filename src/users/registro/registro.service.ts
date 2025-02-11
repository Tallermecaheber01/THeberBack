import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as crypto from 'crypto';
import axios from 'axios';
import * as nodemailer from 'nodemailer'; // Importa nodemailer
import * as moment from 'moment'
import { randomInt } from 'crypto';

@Injectable()
export class RegistroService {
  private verificationCodes: Map<string, { code: string; expiresAt: moment.Moment }> = new Map();
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    // Verificar que el correo no esté vacío
    if (!correo || typeof correo !== 'string' || correo.trim() === '') {
      throw new Error('El correo proporcionado no es valido');
    }

    // Verificar si el correo ya está en uso en la base de datos
    const existingUser = await this.userRepository.findOne({ where: { correo } });
    if (existingUser) {
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
                <p>Tu código de recuperación es: <span class="code">${verificationCode}</span>.</p>
                <p>Este código expirará en 10 minutos.</p>
                <p>Despedida}</p>
            </div>
        </body>
        </html>
    `,
      //text: `Tu código de verificación es: ${verificationCode}. Este código expira en 10 minutos.`,
    });
    console.log('correo enviado')

    return 'Correo con código de verificación enviado';
  }

  async sendVerificationCode2(correo: string): Promise<string> {
    console.log('Correo recibido', correo);

    // Verificar que el correo no esté vacío
    if (!correo || typeof correo !== 'string' || correo.trim() === '') {
      throw new Error('El correo proporcionado no es valido');
    }

    // Verificar si el correo ya está en uso en la base de datos
    const existingUser = await this.userRepository.findOne({ where: { correo } });
    if (existingUser) {
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
      text: `Tu código de verificación es: ${verificationCode}. Este código expira en 10 minutos.`,
    });
    console.log('correo enviado')

    return 'Correo con código de verificación enviado';
  }

  async verifyCode(email: string, code: string): Promise<string> {

    //verificar si el codigo es correcto o ya expiro
    const storedData = this.verificationCodes.get(email);
    console.log(storedData);
    if (!storedData) {
      console.log('Aqui en el if stored pasa el error')
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
    console.log('codigo verificado')
    return 'Código verificado correctamente';
  }




  async createUser(userData: Partial<User>): Promise<User> {
    const { contrasena } = userData;

    // Verificar si la contraseña ha sido comprometida usando la API PwnedPasswords
    const isCompromised = await this.checkPasswordPwned(contrasena);

    if (isCompromised) {
      throw new Error('La contraseña ha sido comprometida en una brecha de seguridad. Por favor, elige otra.');
    }

    // Encriptar la contraseña con MD5 si no ha sido comprometida
    const encryptedPassword = this.encryptedPasswordWithMD5(contrasena);

    // Sustituir la contraseña en los datos del usuario con la contraseña encriptada
    userData.contrasena = encryptedPassword;

    // Si la contraseña es segura, se crea el nuevo usuario
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
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
      console.error('Error al verificar la contraseña en PwnedPasswords:', error);
      throw new Error('Hubo un error al verificar la contraseña. Intenta nuevamente.');
    }
  }

  // Método para encriptar la contraseña con MD5
  private encryptedPasswordWithMD5(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }
}
