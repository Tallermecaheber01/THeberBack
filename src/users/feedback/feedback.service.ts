import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../entity/feedback.entity';
import { CreateFeedbackDto } from './feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async crearFeedback(feedbackData: CreateFeedbackDto) {
    const nuevoFeedback = this.feedbackRepository.create(feedbackData);
    return await this.feedbackRepository.save(nuevoFeedback);
  }

  async obtenerTodos(): Promise<Feedback[]> {
    return await this.feedbackRepository.find();
  }
}
