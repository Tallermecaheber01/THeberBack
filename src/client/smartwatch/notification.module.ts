import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { SmartwatchLinkEntity } from './smartwatch-link.entity';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { PushModule } from 'src/push/push.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartwatchLinkEntity, ClientEntity]),
    PushModule, // ✅ importante
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
