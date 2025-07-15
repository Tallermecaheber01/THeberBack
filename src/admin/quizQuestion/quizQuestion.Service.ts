import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestion } from './entities/quizQuestion.entity';
import { CreateQuizQuestionDto } from './dto/create_quizQuestion.dto';
import { UpdateQuizQuestionDto } from './dto/update_quizQuestion.dto';
import { DeleteQuizQuestionDto } from './dto/delete_quizQuestion.dto';

@Injectable()
export class QuizQuestionService {
  constructor(
    @InjectRepository(QuizQuestion)
    private readonly repo: Repository<QuizQuestion>,
  ) {}

  /** Listar todas las preguntas */
  findAll(): Promise<QuizQuestion[]> {
    return this.repo.find();
  }

  /** Buscar una por ID */
  async findOne(id: number): Promise<QuizQuestion> {
    const qq = await this.repo.findOne({ where: { id } });
    if (!qq) throw new NotFoundException(`Pregunta #${id} no encontrada`);
    return qq;
  }

  /** Crear nueva pregunta */
  create(dto: CreateQuizQuestionDto): Promise<QuizQuestion> {
    const qq = this.repo.create(dto);
    return this.repo.save(qq);
  }

  /** Actualizar pregunta existente */
  async update(dto: UpdateQuizQuestionDto): Promise<QuizQuestion> {
    const { id, ...rest } = dto;
    const qq = await this.findOne(id);
    Object.assign(qq, rest);
    return this.repo.save(qq);
  }

  /** Eliminar pregunta */
  async remove(dto: DeleteQuizQuestionDto): Promise<void> {
    const { id } = dto;
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Pregunta #${id} no encontrada`);
  }
}
