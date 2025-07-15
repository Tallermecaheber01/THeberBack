import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { Faq } from './entities/FAQ.entity';
import { CreateFaqDto } from './dto/create_FAQ.dto';
import { UpdateFaqDto } from './dto/update_FAQ.dto';
import { DeleteFaqDto } from './dto/delete_FAQ.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepo: Repository<Faq>,
  ) {}

  /** Listar todas las FAQs */
  async findAll(): Promise<Faq[]> {
    return this.faqRepo.find();
  }

  /** Obtener una FAQ por su ID */
  async findOneById(id_faq: number): Promise<Faq> {
    const faq = await this.faqRepo.findOne({ where: { id_faq } });
    if (!faq) {
      throw new NotFoundException(`FAQ con id ${id_faq} no encontrada`);
    }
    return faq;
  }

  /** Buscar una FAQ por coincidencia exacta de pregunta */
  async findByPregunta(pregunta: string): Promise<Faq | null> {
    return this.faqRepo.findOne({ where: { pregunta } });
  }

  /** Crear una nueva FAQ */
  async create(createDto: CreateFaqDto): Promise<Faq> {
    const faq = this.faqRepo.create(createDto);
    return this.faqRepo.save(faq);
  }

  /** Actualizar pregunta y/o respuesta de una FAQ existente */
  async update(updateDto: UpdateFaqDto): Promise<Faq> {
    const { id_faq, ...rest } = updateDto;
    const faq = await this.findOneById(id_faq);
    Object.assign(faq, rest);
    return this.faqRepo.save(faq);
  }

  /** Eliminar una FAQ por ID */
  async remove(deleteDto: DeleteFaqDto): Promise<void> {
    const { id_faq } = deleteDto;
    const result = await this.faqRepo.delete(id_faq);
    if (result.affected === 0) {
      throw new NotFoundException(`FAQ con id ${id_faq} no encontrada`);
    }
  }

  /** (Opcional) Búsqueda parcial por texto en la pregunta */
  async searchPartial(query: string): Promise<Faq[]> {
    return this.faqRepo.find({
      where: { pregunta: Like(`%${query}%`) },
      take: 5,
    });
  }
}

