import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contacts.entity';
import { CreateContactDto } from './dto/create-contacts.dto';
import { UpdateContactDto } from './dto/update-contacts.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  // Método para crear un nuevo contacto
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  // Método para actualizar un contacto existente
  async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    
    if (!contact) {
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }

    // Actualiza el contacto con los nuevos datos
    Object.assign(contact, updateContactDto);
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
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }

    await this.contactRepository.remove(contact);
  }

  // Método para obtener un contacto por id
  async findOneById(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    
    if (!contact) {
      throw new NotFoundException(`Contacto con id ${id} no encontrado`);
    }
  
    return contact;
  }
  
}


