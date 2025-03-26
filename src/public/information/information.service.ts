import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserViewEntity } from './view/vw-users-entity';
import { Repository } from 'typeorm';
//import { LogEntity } from 'src/log/entity/log.entity';
import { LoggerService } from 'src/services/logger/logger.service';

@Injectable()
export class InformationService {
    constructor(
        @InjectRepository(UserViewEntity)
        private readonly userRepository: Repository<UserViewEntity>,

       /* @InjectRepository(LogEntity)
        private readonly logRepository: Repository<LogEntity>,*/

        private readonly logger: LoggerService,
    ) { }

    //Funcion para registrar logs
    /*async saveLog(level: string, message: string, user: string, extraInfo?: string) {
        await this.logRepository.save({
            level,
            message,
            user,
            extraInfo,
            timestamp: new Date(),
        });
    }*/

    async getUserByEmail(correo: string): Promise<UserViewEntity | null> {
        const user = await this.userRepository.findOne({
            where: { correo }, // Usamos 'correo' para buscar al usuario
        });


        /*if (!user) {
            this.logger.error('Consulta de usuario inexistente', { userId: correo, file: 'information.service.ts',line:38 });
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }*/

        return user;
    }

    async getUserRoleByEmail(email: string): Promise<UserViewEntity | null> {
        const user = await this.userRepository.findOne({
            where: { correo: email },  // Usamos `correo: email` para hacer la comparación
            select: ['rol'],            // Solo seleccionamos el campo 'rol'
        });

        if (!user) {
            this.logger.error('Consulta de rol de usuario inexistente', { userId: email, file: 'information.service.ts', line:52 });
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        return user;  // Es importante devolver el resultado o `null` si no se encuentra
    }


}
