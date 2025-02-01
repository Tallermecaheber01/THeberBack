import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class ClientService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
    ){}

    //Funcion para obtener el usuario por su ID
    async getClientById(id:number):Promise<User> {
        return this.userRepository.findOne({where: {id}});
    }
}
