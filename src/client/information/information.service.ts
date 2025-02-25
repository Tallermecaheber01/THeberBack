import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class InformationService {
  constructor(
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
}
