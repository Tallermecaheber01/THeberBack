import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importar TypeOrmModule
import { MercadoPagoService } from './mercado-pago.service';
import { MercadoPagoController } from './mercado-pago.controller';
import { PagoService } from './pago/pago.service';
import { Pago } from './entity/pago.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from 'src/services/logger/logger.service';
import { StateRepairEntity } from './pago/pagado.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(), // <--- Importar ScheduleModule si es necesario
    ConfigModule.forRoot({ envFilePath: `.env`, isGlobal:true}), // <--- Importar ConfigModule para variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // <--- Importar ConfigModule
      useFactory: async (configService : ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME_CLIENT'),
        password: configService.get<string>('DB_PASSWORD_CLIENT'),
        database: configService.get<string>('DB_NAME'),
        entities: [Pago,StateRepairEntity],
        synchronize: false // <--- Registrar entidad aquí
      }),
      inject: [ConfigService], // <--- Inyectar ConfigService
    }),
    TypeOrmModule.forFeature([Pago,StateRepairEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // <--- Registrar el secreto del JWT
    }),
  ], // <--- Registrar entidad aquí
  providers: [MercadoPagoService, PagoService, LoggerService],
  controllers: [MercadoPagoController],
})
export class MercadoPagoModule {}
