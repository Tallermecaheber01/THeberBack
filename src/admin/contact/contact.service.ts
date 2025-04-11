import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contacts.entity';
import { CreateContactDto } from './dto/create-contacts.dto';
import { UpdateContactDto } from './dto/update-contacts.dto';
import { LogEntity } from 'src/log/entity/log.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,

    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) { }

  // Método para guardar logs
  /*private async saveLog(level: string, message: string, extraInfo?: string) {
    await this.logRepository.save({
      level,
      message,
      extraInfo,
      timestamp: new Date(),
    });
  }*/

  // Método para crear un nuevo contacto
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    // Log para la creación de un contacto
    //await this.saveLog('INFO', 'Nuevo contacto creado', `Nombre: ${contact.nombre}`);
    return this.contactRepository.save(contact);
  }

  // Método para actualizar un contacto existente
  async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      // Log para el error de no encontrar el contacto
      //await this.saveLog('ERROR', 'Contacto no encontrado para actualizar', `ID: ${id}`);
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }

    // Actualiza el contacto con los nuevos datos
    Object.assign(contact, updateContactDto);
    // Log para la actualización de un contacto
    //await this.saveLog('INFO', 'Contacto actualizado', `ID: ${updateContactDto.nombre}`)
    return this.contactRepository.save(contact);
  }

  // Puedes agregar un método para obtener todos los contactos
  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find();
  }

  // Método para eliminar un contacto
  async remove(id: number): Promise<void> {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      // Log para el error de no encontrar el contacto
      //await this.saveLog('ERROR', 'Contacto no encontrado para eliminar', `ID: ${id}`);
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }

    await this.contactRepository.remove(contact);
    // Log para la eliminación del contacto
    //await this.saveLog('INFO', 'Contacto eliminado', `ID: ${contact.id}`);
  }

  // Método para obtener un contacto por id
  async findOneById(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      // Log para el error de no encontrar el contacto
      //await this.saveLog('ERROR', 'Contacto no encontrado', `ID: ${id}`);
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }

    // Log para la obtención de un contacto por id
    //await this.saveLog('INFO', 'Contacto obtenido por ID', `ID: ${contact.id}`);
    return contact;
  }

}


