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
        private logRepository: Repository<LogEntity>
    ) { }

    // Método para manejar el login
    async login(loginDto: LoginDto, @Res() res: Response) {
        const { correo, contrasena } = loginDto;

        // Buscar el usuario por el correo electrónico
        const user = await this.userRepository.findOne({ where: { correo } });
        if (!user) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        if (user.estado === "bloqueado") {
            if (new Date() > user.fechaDesbloqueo) {
                if (user.rol === 'empleado' || user.rol === 'admin') {
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
                // Si no ha pasado el tiempo de desbloqueo, mostrar el error de cuenta bloqueada
                throw new HttpException('Cuenta bloqueada. Intenta nuevamente más tarde.', HttpStatus.FORBIDDEN);
            }
        }

        // Comparar la contraseña ingresada con la almacenada (bcrypt)
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

        if (!isPasswordValid) {
            const userRole = user.rol;
            if (userRole === 'empleado' || userRole === 'admin') {
                const authorizedPersonnel = await this.personnelRepository.findOne({ where: { correo } });
                if (!authorizedPersonnel) {
                    throw new Error('Empleado o administrados no encontrado');
                }
                authorizedPersonnel.intentosFallidos += 1;

                if (authorizedPersonnel.intentosFallidos >= 5) {
                    authorizedPersonnel.estado = "bloqueado";
                    user.fechaDesbloqueo = new Date(new Date().getTime() + 5 * 60 * 1000); // Bloqueo de 5 minutos
                }

                await this.personnelRepository.save(authorizedPersonnel);

            } else if (userRole === 'cliente') {
                const client = await this.clientRepository.findOne({ where: { correo } });

                if (!client) {
                    throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
                }

                client.intentosFallidos += 1;

                if (client.intentosFallidos >= 5) {
                    client.estado = "bloqueado";
                    client.fechaDesbloqueo = new Date(new Date().getTime() + 5 * 60 * 1000); // Bloqueo de 5 minutos
                }

                await this.clientRepository.save(client);
            } else {
                throw new HttpException('Rol de usuario no válido', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        // Si el login es exitoso, restablecer intentos y fecha de desbloqueo
        if (user.rol === 'empleado' || user.rol === 'admin') {
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
        const token = this.jwtService.sign(payload);

        res.cookie('authToken', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60, // 1 hora
            path: '/',
        });


        return res.status(200).json({ success: true });

    }
}
