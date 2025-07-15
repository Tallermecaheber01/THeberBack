import { Injectable } from '@nestjs/common';
import { VistaRepairsEmpleados } from './view/vista_repairs_empleados';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryRepairsService {
    constructor(
        @InjectRepository(VistaRepairsEmpleados)
        private readonly vistaRepairsEmpleadosRepository: Repository<VistaRepairsEmpleados>
    ) { }

    async obtenerPorCliente(idCliente: number): Promise<VistaRepairsEmpleados[]> {
        return this.vistaRepairsEmpleadosRepository.find({
            where: { idCliente },
        });
    }

}
