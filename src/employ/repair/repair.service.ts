import { Injectable } from '@nestjs/common';

import { RepairEntity } from './entities/repair.entity';//Importamos la entidad tabla de la base de datos
import { CreateRepairDto } from './dto/create-repair.dto'; //Importamos el dto para crear, que son los datos de transeferencia del objeto
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RepairService {
    constructor(
        @InjectRepository(RepairEntity)//Aqui se dice que se injectara cierto dato en el repositorio o tabla
        private readonly repairRepository: Repository<RepairEntity> //se crea el objeto a usar
    ){}

    /**Este es un ejemplo simple de como se podria guardar
     * una nueva reparacion, hace uso del dto, del objeto
     * repairRepository y de la entidad de este
     * esta funcion se usara en el controlador del empleado
     */
    async createNewRepair(repairData: CreateRepairDto): Promise<RepairEntity>{
        const newRepair = this.repairRepository.create(repairData);
        return this.repairRepository.save(newRepair);
    }
}
