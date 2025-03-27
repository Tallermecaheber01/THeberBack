import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto'; // Usaremos crypto para generar el hash MD5
import * as bcrypt from 'bcrypt'
import { User } from '../entity/user.entity';
import { LoginDto } from './login.dto';
import { Response } from 'express';
import { LogEntity } from 'src/log/entity/log.entity';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) { }

  // Método para manejar el login
  async login(loginDto: LoginDto, @Res() res: Response) {
    const { correo, contrasena } = loginDto;

    // Buscar el usuario por el correo electrónico
    const user = await this.userRepository.findOne({ where: { correo } });

    if (!user) {
      // Si el usuario no se encuentra, registrar el log de intento fallido
      await this.logRepository.save({
        timestamp: new Date(),
        level: 'ERROR',
        message: 'Usuario no encontrado',
        user: correo,  // Puedes registrar el correo del usuario o el identificador
        extraInfo: 'Intento de login fallido',
      });

      throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
    }

    // Verificar si el usuario está bloqueado
    if (user.estadoBloqueo) {
      // Si la cuenta está bloqueada, comprobar si la fecha de desbloqueo ha pasado
      if (new Date() > user.fechaDesbloqueo) {
        // Si ya ha pasado la fecha de desbloqueo, desbloquear la cuenta
        user.estadoBloqueo = false;
        user.fechaDesbloqueo = null;

        // Registrar el log de desbloqueo de cuenta
        await this.logRepository.save({
          timestamp: new Date(),
          level: 'INFO',
          message: 'Cuenta desbloqueada',
          user: correo,
          extraInfo: `El bloqueo ha finalizado. El usuario ahora puede iniciar sesión nuevamente.`,
        });

        await this.userRepository.save(user);
      } else {
        // Si no ha pasado el tiempo de desbloqueo, mostrar el error de cuenta bloqueada
        throw new HttpException('Cuenta bloqueada. Intenta nuevamente más tarde.', HttpStatus.FORBIDDEN);
      }
    }

    // Comparar la contraseña ingresada con la contraseña almacenada (bcrypt)
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid) {
      // Registrar el log de contraseña incorrecta
      await this.logRepository.save({
        timestamp: new Date(),
        level: 'ERROR',
        message: 'Contraseña incorrecta',
        user: correo,  // Registrar el correo del usuario que intenta iniciar sesión
        extraInfo: 'Intento de login fallido',
      });

      // Incrementar los intentos fallidos
      user.intentosFallidos += 1;

      // Si los intentos fallidos alcanzan el límite, bloquear la cuenta
      if (user.intentosFallidos >= 5) {
        user.estadoBloqueo = true;
        user.fechaDesbloqueo = new Date(new Date().getTime() + 5 * 60 * 1000); // Bloqueo de 5 minutos

        // Registrar el log de bloqueo de cuenta
        await this.logRepository.save({
          timestamp: new Date(),
          level: 'ERROR',
          message: 'Cuenta bloqueada',
          user: correo,  // Registrar el correo del usuario
          extraInfo: `Usuario bloqueado temporalmente debido a intentos fallidos. Bloqueo hasta: ${user.fechaDesbloqueo}`,
        });
      }


      await this.userRepository.save(user);

      throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
    }

    // Si el login es exitoso, reiniciar los intentos fallidos y desbloquear la cuenta
    user.intentosFallidos = 0;
    user.estadoBloqueo = false;
    user.fechaDesbloqueo = null;

    await this.userRepository.save(user);

    // Generar el JWT con los datos del usuario
    const payload = { userId: user.id, email: user.correo };
    const token = this.jwtService.sign(payload);

    // Registrar el log de login exitoso
    await this.logRepository.save({
      timestamp: new Date(),
      level: 'INFO',
      message: 'Login exitoso',
      user: correo,  // Registrar el correo del usuario que inicia sesión
      extraInfo: 'Login realizado correctamente',
    });

    res.cookie('authToken', token, {
      secure: process.env.NODE_ENV === 'production',
      //maxAge: 1000 * 60 * 60, // 1 hora
      maxAge: user.rol === 'cliente' ? 1000 * 60 * 60 : 1000 * 60 * 30,
      path: '/',
      sameSite:'strict'
  });
    
    

    return res.status(200).json({ success: true });
  }
}
