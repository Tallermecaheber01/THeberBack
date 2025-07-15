import { Body, Controller, Delete,  Get, Param, Post, UsePipes, ValidationPipe, Logger ,ParseIntPipe  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { NotificationService } from './smartwatch/notification.service'; 
import { LinkSmartwatchDto } from './smartwatch/comparate_token_smartwatch.dto';
import { UnlinkSmartwatchDto } from './smartwatch/unlink-smartwatch.dto';
import { FeedbackService } from './feedback/feedback.service';
import { CreateFeedbackDto } from './feedback/dto/create-feedback.dto';
import { FeedbackEntity } from './feedback/entities/feedback.entity';


@Controller('client')
export class ClientController {
  private readonly logger = new Logger(ClientController.name);
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,

    private readonly notificationService: NotificationService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post(':id/generar-codigo-smartwatch')
  async generarCodigoSmartwatch(@Param('id') id: number): Promise<{ code: string }> {
    const user = await this.clientRepository.findOne({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');

    const code = await this.notificationService.generarCodigoSmartwatch(user);
    return { code };
  }
    @Post('vinculacion')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async linkSmartwatch(@Body() dto: LinkSmartwatchDto): Promise<{ message: string }> {
    this.logger.log(`Petición de vinculación recibida con código: ${dto.code}`);
    await this.notificationService.linkSmartwatch(dto.code, dto.fcmToken);
    return { message: 'Vinculación exitosa' };
  }

    @Post('desvincular_smartwatch')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async unlinkSmartwatch(
    @Body() dto: UnlinkSmartwatchDto
  ): Promise<{ message: string }> {
    this.logger.log(`Petición desvincular recibida, token: ${dto.fcmToken}`);
    await this.notificationService.unlinkSmartwatchByToken(dto.fcmToken);
    return { message: 'Desvinculación exitosa' };
  }

  @Post(':id/feedback')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateFeedbackDto
  ): Promise<FeedbackEntity> {
    return await this.feedbackService.create(dto);
  }

  // Obtiene todos los feedbacks
   
  @Get('feedback')
  async getAllFeedback(): Promise<FeedbackEntity[]> {
    return await this.feedbackService.findAll();
  }

  //Obtiene un feedback por ID
   
  @Get('feedback/:feedbackId')
  async getFeedbackById(
    @Param('feedbackId', ParseIntPipe) feedbackId: number
  ): Promise<FeedbackEntity> {
    return await this.feedbackService.findOneById(feedbackId);
  }

  // Elimina un feedback por ID
   
  @Delete('feedback/:feedbackId')
  async deleteFeedback(
    @Param('feedbackId', ParseIntPipe) feedbackId: number
  ): Promise<{ message: string }> {
    await this.feedbackService.remove(feedbackId);
    return { message: 'Feedback eliminado exitosamente' };
  }

}

