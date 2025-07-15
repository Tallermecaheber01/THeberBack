import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackEntity } from './entities/feedback.entity'
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
  ) {}

  //hacer un nuevo feedback
  async create(dto: CreateFeedbackDto): Promise<FeedbackEntity> {
    const feedback = this.feedbackRepository.create(dto);
    return this.feedbackRepository.save(feedback);
  }

  //consulta de feedback
  async findAll(): Promise<FeedbackEntity[]> {
    return this.feedbackRepository.find();
  }

  /**
   * buscar por ID
   * @throws NotFoundException si no existe el feedback
   */
  async findOneById(id: number): Promise<FeedbackEntity> {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException(`Feedback con id ${id} no fue encontrado`);
    }
    return feedback;
  }

  /**
   * Elimina por ID
   * @throws NotFoundException si no existe el feedback
   */
  async remove(id: number): Promise<void> {
    const result = await this.feedbackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Feedback con id ${id} no fue encontrado`);
    }
  }
}
