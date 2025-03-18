import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserViewEntity } from './view/vw-users-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';


@Injectable()
export class LoginService {
    constructor(
        private jwtService: JwtService,

        @InjectRepository(UserViewEntity)
        private userRepository: Repository<UserViewEntity>,
    ) { }

    // Método para manejar el login
    async login(loginDto: LoginDto, @Res() res: Response) {
        const { correo, contrasena } = loginDto;

        // Buscar el usuario por el correo electrónico
        const user = await this.userRepository.findOne({ where: { correo } });

        if (!user) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        // Comparar la contraseña ingresada con la almacenada (bcrypt)
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

        if (!isPasswordValid) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
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
