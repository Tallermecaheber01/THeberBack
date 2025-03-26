import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['authToken'] || request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Token no proporcionado');
    }

    try {
      // Verificar y decodificar el token
      const decoded = this.jwtService.verify(token);

      // Asignar la información decodificada al request
      request.user = decoded;
      return true;
    } catch (err) {
      console.error('Error al verificar el token', err);
      return false;  // Si hay error al verificar, no dejamos pasar la solicitud
    }
  }
}
