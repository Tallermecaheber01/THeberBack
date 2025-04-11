import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    // Imprimir el objeto 'user' para verificar si contiene el rol esperado
    console.log('User recibido:', user);  // Esto imprimirá la información del usuario que viene en la solicitud

    const hasRole = () => roles.includes(user.role);  // Cambiado a `user.role`
    const userEmail = user.email;
    console.log(userEmail)

    return user && user.role && hasRole();  // Cambiado a `user.role`
  }
}
