import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto'; // Usaremos crypto para generar el hash MD5
import { User } from '../entity/user.entity';
import { LoginDto } from './login.dto';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Método para manejar el login
  async login(loginDto: LoginDto) {
    const { correo, contrasena } = loginDto;

    // Buscar el usuario por el correo electrónico
    const user = await this.userRepository.findOne({ where: { correo } });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Generar el hash MD5 de la contraseña ingresada
    const hashedPassword = crypto.createHash('md5').update(contrasena).digest('hex');

    // Comparar la contraseña en MD5
    if (user.contrasena !== hashedPassword) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar el JWT con los datos del usuario
    const payload = { userId: user.id, email: user.correo };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      token,
    };
  }
}
