import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { LoggerService } from './services/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService()
  });

  // A05 & A09: Seguridad global con Helmet (se recomienda aplicar antes de cualquier otra cosa)
  app.use(helmet());
  // Deshabilitar el encabezado X-Powered-By para A09
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  // A05: Forzar el encabezado para evitar MIME-sniffing
  app.use(helmet.noSniff());
  // A07: Agregar protección contra clickjacking (X-Frame-Options)
  app.use(helmet.frameguard({ action: 'deny' }));

  // A05: Configuración de Content Security Policy (CSP) reforzado
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", 'http://localhost:3000'], // Asegura que las solicitudes sean aceptadas
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
        },
      },
      frameguard: { action: 'deny' },
      noSniff: true,
    })
  );


  // A01: Configuración restrictiva de CORS
  app.enableCors({
    origin: ['http://localhost:3001'], // Asegura que el frontend puede hacer solicitudes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'], // Permitir que el cliente vea Authorization en la respuesta
    credentials: true,
  });
  

  // Si tienes rutas estáticas, asegúrate de que también tengan los encabezados de seguridad:
  app.use('/static', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // Aquí podrías agregar otros encabezados si es necesario, por ejemplo:
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  // Middleware para cookies
  app.use(cookieParser());

  const logger = app.get(LoggerService);

  try {
    await app.listen(3000);
    //throw new Error('¡Error de prueba!');
    logger.log('La aplicación se ha arrancado', 'Bootstrap'); // Usando log en lugar de console.log
  } catch (error) {
    logger.error('La aplicación no se ha arrancado debido a un error', { file: 'main.ts', line: 66 });
  }

}

bootstrap();
