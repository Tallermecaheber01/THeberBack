import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroController } from './registro.controller';
import { RegistroService } from './registro.service';
import { usuarios } from './entities/registro-entity';
@Module({
  imports: [TypeOrmModule.forFeature([usuarios])], // Importa las entidades necesarias
  controllers: [RegistroController], // Incluye el controlador
  providers: [RegistroService], // Incluye el servicio
  exports: [RegistroService], // Exporta el servicio si lo usarán otros módulos
})
export class RegistroModule {}
