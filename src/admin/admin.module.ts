import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { ServiceService } from './service/service.service';
import { ServiceEntity } from './service/service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ServiceEntity])],
  controllers: [AdminController],
  providers: [ServiceService],
  exports: [ServiceService], // Exporta si se necesita en otros módulos
})
export class AdminModule {}
