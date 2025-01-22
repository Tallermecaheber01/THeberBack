import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken'; // Asegúrate de instalar jsonwebtoken
import { usuarios } from './login.entity';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(usuarios)
    private readonly loginRepository: Repository<usuarios>,
  ) { }

  async validateLogin(usuario: string, contrasena: string): Promise<{ user: usuarios; token: string }> {
    // Encriptar la contraseña con MD5
    const hashedPassword = crypto.createHash('md5').update(contrasena).digest('hex');

    // Buscar el usuario en la base de datos
    const user = await this.loginRepository.findOne({
      where: { usuario, contrasena: hashedPassword },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // Crear el token
    const token = this.generateToken(user);

    return { user, token }; // Devuelve el usuario y el token
  }

  private generateToken(user: usuarios) {
    const payload = { rol: user.rol, id: user.id };
    const secret = 'dff3c7ef5be6b1dfa77350c0eeb786c529ecc1312f4660b794cbcc1562ef924a'; // Asegúrate de que esto no sea undefined
    if (!secret) {
      throw new Error('JWT_SECRET no está definido');
    }
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }
  validateToken(req) {
    const token = req.cookies['authToken'];

    if (!token) {
      throw new UnauthorizedException('No se proporcionó el token.');
    }

    try {
      const decoded = jwt.verify(token, 'dff3c7ef5be6b1dfa77350c0eeb786c529ecc1312f4660b794cbcc1562ef924a');
      return decoded;
    } catch (e) {
      throw new UnauthorizedException('Token no válido.');
    }
  }
}
