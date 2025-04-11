import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/services/logger/logger.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly logger: LoggerService,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['authToken'] || request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      this.logger.error('Intento de recuperar información sin un token proporcionado');
      throw new HttpException('Token no proporcionado', HttpStatus.UNAUTHORIZED);
    }


    try {
      // Verificar y decodificar el token
      const decoded = this.jwtService.verify(token);

      // Asignar la información decodificada al request
      request.user = decoded;
      return true;
    } catch (err) {
      this.logger.error('Error al verificar el token', err);
      return false;  // Si hay error al verificar, no dejamos pasar la solicitud
    }
  }
}
