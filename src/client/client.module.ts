import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { ClientService } from './client.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  UsersModule],
  controllers: [ClientController],
  providers:[ClientService],
})
export class ClientModule {}
