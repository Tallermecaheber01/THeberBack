import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { usuarios } from './entities/registro-entity';
import * as crypto from 'crypto';  // Importa el módulo crypto

@Injectable()
export class RegistroService {
  constructor(
    @InjectRepository(usuarios)
    private registroRepository: Repository<usuarios>,
  ) {}

  // Método para crear un nuevo usuario
  async createUser(
    nombre: string,
    apellidoPaterno:string,
    apellidoMaterno:string,
    correo: string,
    telefono: string,
    usuario: string,
    contrasena: string,
  ): Promise<usuarios> {
    // Verificar si el correo ya está registrado
    const existingUserByCorreo = await this.registroRepository.findOne({ where: { correo } });
    if (existingUserByCorreo) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Verificar si la contraseña ya está registrada
    const existingUserByContrasena = await this.registroRepository.findOne({ where: { contrasena } });
    if (existingUserByContrasena) {
      throw new Error('La contraseña ya está en uso');
    }

    // Encriptar la contraseña con MD5 utilizando crypto
    const contrasenaEncriptada = crypto.createHash('md5').update(contrasena).digest('hex');

    // Crear un nuevo usuario con la contraseña encriptada
    const user = this.registroRepository.create({
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      telefono,
      usuario,
      contrasena: contrasenaEncriptada,
    });

    // Insertar el usuario en la base de datos
    return this.registroRepository.save(user);
  }
}
