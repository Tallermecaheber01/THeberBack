import { LoggerService } from 'src/services/logger/logger.service';
import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserViewEntity } from './view/vw-users-entity';
import { ClientEntity } from '../recover-password/entity/client-entity';
import { AuthorizedPersonnelEntity } from '../recover-password/entity/authorized-personnel-entity';
import { LogEntity } from 'src/log/entity/log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';


@Injectable()
export class LoginService {
    constructor(
        private jwtService: JwtService,

        @InjectRepository(UserViewEntity)
        private userRepository: Repository<UserViewEntity>,

        @InjectRepository(ClientEntity)
        private clientRepository: Repository<ClientEntity>,

        @InjectRepository(AuthorizedPersonnelEntity)
        private personnelRepository: Repository<AuthorizedPersonnelEntity>,

        @InjectRepository(LogEntity)
        private logRepository: Repository<LogEntity>,

        private readonly logger: LoggerService
    ) { }

    // Función para registrar logs
    async saveLog(level: string, message: string, user: string, extraInfo?: string) {
        await this.logRepository.save({
            level,
            message,
            user,
            extraInfo,
            timestamp: new Date(),
        });
    }

    // Método para manejar el login
    async login(loginDto: LoginDto, @Res() res: Response) {
        const { correo, contrasena } = loginDto;

        // Buscar el usuario por el correo electrónico
        const user = await this.userRepository.findOne({ where: { correo } });
        if (!user) {
            //Guardar log de intento fallido
            //await this.saveLog('WARNING', 'Login', correo, `Intento de login con el correo no registrado`);
            this.logger.error('Intento de inicio de sesión a una cuenta que no existe', { userId: correo, file: 'login.service.ts', line: 55 });
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        if (user.estado === "bloqueado") {
            if (new Date() > user.fechaDesbloqueo) {
                if (user.rol === 'empleado' || user.rol === 'administrador') {
                    const authorizedPersonnel = await this.personnelRepository.findOne({ where: { correo } });
                    if (authorizedPersonnel) {
                        authorizedPersonnel.intentosFallidos = 0;
                        authorizedPersonnel.fechaDesbloqueo = null;
                        authorizedPersonnel.estado = "activo";
                        await this.personnelRepository.save(authorizedPersonnel);
                    }
                } else if (user.rol === 'cliente') {
                    const client = await this.clientRepository.findOne({ where: { correo } });

                    if (client) {
                        client.intentosFallidos = 0;
                        client.fechaDesbloqueo = null;
                        client.estado = "activo";
                        await this.clientRepository.save(client);

                    }
                }
            } else {


                //await this.saveLog('ERROR', 'Login', correo, `Intento de login en cuenta bloqueada`);
                this.logger.warn('Intento de inicio de sesion en cuenta bloqueada', { userId: correo, file: 'login.service.ts', line: 84 });
                // Si no ha pasado el tiempo de desbloqueo, mostrar el error de cuenta bloqueada
                throw new HttpException('Cuenta bloqueada. Intenta nuevamente más tarde.', HttpStatus.FORBIDDEN);
            }
        }

        // Comparar la contraseña ingresada con la almacenada (bcrypt)
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

        if (!isPasswordValid) {
            const userRole = user.rol;
            if (userRole === 'empleado' || userRole === 'administrador') {
                const authorizedPersonnel = await this.personnelRepository.findOne({ where: { correo } });
                if (!authorizedPersonnel) {
                    this.logger.error('Empleado o administrador no encontrado', { userId: correo, file: 'login.service.ts', line: 98 });
                    throw new Error('Empleado o administrados no encontrado');
                }
                authorizedPersonnel.intentosFallidos += 1;

                if (authorizedPersonnel.intentosFallidos >= 5) {
                    authorizedPersonnel.estado = "bloqueado";
                    authorizedPersonnel.fechaDesbloqueo = new Date(new Date().getTime() + 5 * 60 * 1000); // Bloqueo de 5 minutos
                    this.logger.warn('Cuenta de personal autorizado bloqueada temporalmente por exceder limite de intentos', { userId: correo, file: 'login.service.ts', line: 106 });
                    //await this.saveLog('ERROR', 'Login', correo, `Cuenta bloqueada temporalmente`);
                }

                await this.personnelRepository.save(authorizedPersonnel);

            } else if (userRole === 'cliente') {
                const client = await this.clientRepository.findOne({ where: { correo } });

                if (!client) {
                    this.logger.error('Cliente no encontrado', { userId: correo, file: 'login.service.ts', line: 116 });
                    throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
                }

                client.intentosFallidos += 1;

                if (client.intentosFallidos >= 5) {
                    client.estado = "bloqueado";
                    client.fechaDesbloqueo = new Date(new Date().getTime() + 5 * 60 * 1000); // Bloqueo de 5 minutos
                    this.logger.warn('Cuenta del cliente bloqueada temporalmente por exceder limite de intentos', { userId: correo, file: 'login.service.ts', line: 125 });
                    await this.saveLog('ERROR', 'Login', correo, `Cuenta bloqueada temporalmente`);
                }

                await this.clientRepository.save(client);
            } else {
                /*await this.saveLog(
                    'ERROR',
                    'Login fallido',
                    correo || 'Correo no registrado',
                    `Intento de login con un rol no válido: ${user?.rol || 'Desconocido'}`
                );*/

                this.logger.error('El rol para esta cuenta no es válido', { userId: correo, file: 'login.service.ts', line: 138 });
                throw new HttpException('Rol de usuario no válido', HttpStatus.BAD_REQUEST);
            }
            //await this.saveLog('ERROR', 'Login', correo, `Contraseña incorrecta`);
            this.logger.warn('Se esta intentando acceder a la cuenta con contraseñas incorrectas', { userId: correo, file: 'login.service.ts', line: 142 });
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        // Si el login es exitoso, restablecer intentos y fecha de desbloqueo
        if (user.rol === 'empleado' || user.rol === 'administrador') {
            const authorizedPersonnel = await this.personnelRepository.findOne({ where: { correo } });

            if (authorizedPersonnel) {
                authorizedPersonnel.intentosFallidos = 0;
                authorizedPersonnel.fechaDesbloqueo = null;
                authorizedPersonnel.estado = "activo";
                await this.personnelRepository.save(authorizedPersonnel);
            }
        } else if (user.rol === 'cliente') {
            const client = await this.clientRepository.findOne({ where: { correo } });

            if (client) {
                client.intentosFallidos = 0;
                client.fechaDesbloqueo = null;
                client.estado = "activo";
                await this.clientRepository.save(client);

            }
        }

        // Generar el JWT con los datos del usuario
        const payload = { userId: user.id, email: user.correo, role: user.rol };
        const expiresIn = user.rol === 'cliente' ? '1h' : '30m';
        const token = this.jwtService.sign(payload, { expiresIn });

        const userType = user.rol === 'cliente' ? 'Cliente' : 'Personal autorizado';
        // Imprimir en consola el mensaje solicitado
        console.log(`🔑 Token generado para: ${userType} | Tiempo de expiración: ${expiresIn}`);

        // Obtener la hora exacta en la que se crea el token, ajustada a la zona horaria de México
        const currentTime = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

        // Imprimir en consola el mensaje solicitado con la hora exacta en la zona horaria de México
        console.log(`🔑 Token generado para: ${userType} | Tiempo de expiración: ${expiresIn} | Hora de creación: ${currentTime}`);

        res.cookie('authToken', token, {
  secure: true,       // Necesario para producción en HTTPS
  sameSite: 'none',   // Permite cookies de terceros
  httpOnly: false,    // Permite acceso desde document.cookie
  path: '/',
  domain: 'https://theberback.onrender.com', // Usa el dominio correcto si es necesario
  expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora de duración
});


        // 🔹 Guardar log de sesión exitosa
        //await this.saveLog('INFO', 'Login', user.correo, `Inicio de sesión exitoso`);
        console.log('Inicio de sesion realizado correctamente', { userId: correo, file: 'login.service.ts' })

        return res.status(200).json({
            success: true,
            token: token,  // Retorna el token generado
        });


    }
}
