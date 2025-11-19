import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  subscribe(@Body() subscription: any) {
    this.pushService.saveSubscription(subscription);
    return { message: 'Suscripción registrada correctamente' };
  }

  @Post('send')
  async sendNotification(@Body() data: { title: string; body: string }) {
    await this.pushService.sendNotification(data.title, data.body);
    return { message: 'Notificación enviada' };
  }
}
