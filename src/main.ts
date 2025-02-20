import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Elimina campos no definidos en el DTO
    forbidNonWhitelisted: true,  // Retorna error si se envían campos no esperados
    transform: true,  // Convierte tipos automáticamente (por ejemplo, string a number)
  }));
  // Habilitar CORS solo para el origen especificado
  app.enableCors({
    origin: 'http://localhost:3001', // Asegúrate de especificar tu frontend
    methods: 'GET, POST, PUT, DELETE,OPTIONS', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeceras permitidas
    credentials: true, // Permitir enviar cookies
  });

  app.use(cookieParser()); // Usar cookie-parser para manejar las cookies

  await app.listen(3000);
}

bootstrap();
