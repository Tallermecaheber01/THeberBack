import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { InformationService } from './information/information.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
@Module({
    imports: [TypeOrmModule.forFeature([User ])],
  controllers: [ClientController],
  providers: [InformationService],
  exports:[InformationService]
})
export class ClientModule {}
