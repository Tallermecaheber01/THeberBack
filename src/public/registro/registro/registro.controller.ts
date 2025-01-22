import { Controller, Post, Body } from '@nestjs/common';
import { RegistroService } from './registro.service';
import { usuarios } from './entities/registro-entity'; // Asegúrate de importar la entidad User

@Controller('registro') // Ruta base para el registro
export class RegistroController {
  constructor(private readonly registroService: RegistroService) {}

  @Post() // Método POST para registrar un nuevo usuario
  async register(
    @Body() body: {
      nombre: string;
      apellidoPaterno:string;
      apellidoMaterno:string;
      correo: string;
      telefono: string;
      usuario: string;
      contrasena: string;
    },
  ): Promise<usuarios> {
    return this.registroService.createUser(
      body.nombre,
      body.apellidoPaterno,
      body.apellidoMaterno,
      body.correo,
      body.telefono,
      body.usuario,
      body.contrasena,
    );
  }
}
