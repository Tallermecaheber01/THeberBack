import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizContact } from './entities/quizContact.entity';
import { UpdateQuizContactDto } from './dto/update_quizContac.dto';

@Injectable()
export class QuizContactService {
  constructor(
    @InjectRepository(QuizContact)
    private readonly contactRepo: Repository<QuizContact>,
  ) {}

  async findOne(id = 1): Promise<QuizContact> {
    const contact = await this.contactRepo.findOneBy({ id });
    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }
    return contact;
  }

  async update(updateDto: UpdateQuizContactDto): Promise<QuizContact> {
    const contact = await this.findOne();
    const updated = this.contactRepo.merge(contact, updateDto);
    return this.contactRepo.save(updated);
  }

}
