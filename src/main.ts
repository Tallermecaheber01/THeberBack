import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS solo para el origen especificado
  app.enableCors({
    origin: 'http://localhost:3000', // Asegúrate de especificar tu frontend
    methods: 'GET, POST, PUT, DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeceras permitidas
    credentials: true, // Permitir enviar cookies
  });

  app.use(cookieParser()); // Usar cookie-parser para manejar las cookies

  await app.listen(3001);
}

bootstrap();
