import { Controller, Post, Body, UnauthorizedException, Response } from '@nestjs/common';
import { LoginService } from './login.service';
import { Response as ExpressResponse } from 'express'; // Asegúrate de usar ExpressResponse

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(
    @Body() body: { usuario: string; contrasena: string },
    @Response() res: ExpressResponse,
  ) {
    const { usuario, contrasena } = body;

    if (!usuario || !contrasena) {
      throw new UnauthorizedException('El nombre de usuario y la contraseña son obligatorios.');
    }

    const { user, token } = await this.loginService.validateLogin(usuario, contrasena);

    // Establecer el token en la cookie HttpOnly
    res.cookie('authToken', token, {
      httpOnly: true,  // La cookie no es accesible por JavaScript
      secure: process.env.NODE_ENV === 'production',  // Solo en HTTPS en producción
      maxAge: 3600000,  // La cookie expirará en 1 hora
    });

    // Devuelve una respuesta de éxito
    return res.json({ message: 'Inicio de sesión exitoso', user,token });
  }
}
