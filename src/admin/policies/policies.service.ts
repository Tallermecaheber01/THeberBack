import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Police } from './entities/policies.entity';
import { PoliceEstado,CreatePoliceDto } from './dto/create-policies.dto';
import { UpdatePoliceDto } from './dto/update-policies.dto';

@Injectable()
export class PoliceService {
  constructor(
    @InjectRepository(Police)
    private policeRepository: Repository<Police>,

   
  ) {}


  // Método para crear un nuevo registro de police
async create(createPoliceDto: CreatePoliceDto): Promise<Police> {
    // Actualiza todos los registros que estén activos a inactivos
    await this.policeRepository.createQueryBuilder()
      .update(Police)
      .set({ estado: PoliceEstado.Inactivo })
      .where("estado = :estado", { estado: PoliceEstado.Activo })
      .execute();
  
    // Crear instancia de la entidad Police con los datos correctos
    const police = this.policeRepository.create({
      ...createPoliceDto,
      fecha: new Date().toISOString(), // Fecha actual en formato ISO 8601
      estado: PoliceEstado.Activo, // Siempre se crea como activo
    });
  
    // Log para la creación del registro
    //await this.saveLog('INFO', 'Nueva police creada', `Descripción: ${police.descripcion}, Estado: ${police.estado}`);
  
    // Guardar en la base de datos y devolver el objeto creado
    return this.policeRepository.save(police);
  }
  
  

  // Método para actualizar un registro existente
  async update(id: number, updatePoliceDto: UpdatePoliceDto): Promise<Police> {
    const police = await this.policeRepository.findOne({ where: { id } });
    if (!police) {
      // Log para el error al no encontrar el registro
      //await this.saveLog('ERROR', 'Police no encontrada para actualizar', `ID: ${id}`);
      throw new NotFoundException(`Police con id ${id} no encontrada`);
    }
    Object.assign(police, updatePoliceDto);
    // Log para la actualización del registro
    //await this.saveLog('INFO', 'Police actualizada', `ID: ${id}`);
    return this.policeRepository.save(police);
  }

  // Método para obtener todos los registros
  async findAll(): Promise<Police[]> {
    return this.policeRepository.find();
  }

  // Método para eliminar un registro
  async remove(id: number): Promise<void> {
    const police = await this.policeRepository.findOne({ where: { id } });
    if (!police) {
      // Log para el error al no encontrar el registro para eliminar
      //await this.saveLog('ERROR', 'Police no encontrada para eliminar', `ID: ${id}`);
      throw new NotFoundException(`Police con id ${id} no encontrada`);
    }
    await this.policeRepository.remove(police);
    // Log para la eliminación del registro
    //await this.saveLog('INFO', 'Police eliminada', `ID: ${id}`);
  }

  // Método para obtener un registro por ID
  async findOneById(id: number): Promise<Police> {
    const police = await this.policeRepository.findOne({ where: { id } });
    if (!police) {
      // Log para el error al no encontrar el registro
      //await this.saveLog('ERROR', 'Police no encontrada', `ID: ${id}`);
      throw new NotFoundException(`Police con id ${id} no encontrada`);
    }
    // Log para la obtención del registro
    //await this.saveLog('INFO', 'Police obtenida por ID', `ID: ${id}`);
    return police;
  }

  // Método para actualizar solo el estado: activa la police seleccionada y desactiva las demás
async actualizarEstado(id: number): Promise<Police> {
    // Verificar que la police con el id dado exista
    const police = await this.policeRepository.findOne({ where: { id } });
    if (!police) {
      //await this.saveLog('ERROR', 'Police no encontrada para actualizar estado', `ID: ${id}`);
      throw new NotFoundException(`Police con id ${id} no encontrada`);
    }
    
    // Actualizar todas las police que estén activas a inactivas
    await this.policeRepository.createQueryBuilder()
      .update(Police)
      .set({ estado: PoliceEstado.Inactivo })
      .where("estado = :estado", { estado: PoliceEstado.Activo })
      .execute();
    
    // Establecer la police actual como activa
    police.estado = PoliceEstado.Activo;
    //await this.saveLog('INFO', 'Estado actualizado a activo', `ID: ${id}`);
    
    // Guardar y retornar la police actualizada
    return this.policeRepository.save(police);
  }
  
}
