import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserViewEntity } from './view/vw-users-entity';
import { Repository } from 'typeorm';

@Injectable()
export class InformationService {
    constructor(
        @InjectRepository(UserViewEntity)
        private readonly userRepository: Repository<UserViewEntity>,
    ) { }

    async getUserByEmail(correo: string): Promise<UserViewEntity | null> {
        const user = await this.userRepository.findOne({
            where: { correo }, // Usamos 'correo' para buscar al usuario
        });


        if (!user) {
            // Si no se encuentra el usuario, lanzamos una excepción
            throw new Error('Usuario no encontrado');
        }
        return user;
    }

    async getUserRoleByEmail(email: string): Promise<UserViewEntity | null> {
        const user = await this.userRepository.findOne({
            where: { correo: email },  // Usamos `correo: email` para hacer la comparación
            select: ['rol'],            // Solo seleccionamos el campo 'rol'
        });

        if (!user) {
            // Si el usuario no existe, lanzamos una excepción
            throw new Error('Usuario no encontrado');
        }

        return user;  // Es importante devolver el resultado o `null` si no se encuentra
    }


}
