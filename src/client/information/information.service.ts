import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InformationService {
  /*constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // Método para obtener un usuario por ID
  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      // Puedes lanzar una excepción si el usuario no existe
      throw new Error('Usuario no encontrado');
    }

    return user;
  }
  
  // Método para obtener solo el rol de un usuario por ID
  async getUserRoleById(id: number): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['rol'], // Solo seleccionamos el campo 'role'
    });

    if (!user) {
      // Si el usuario no existe, lanzamos una excepción
      throw new Error('Usuario no encontrado');
    }
    return user.rol; // Retorna solo el rol
  }*/
}
