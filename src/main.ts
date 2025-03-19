import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        // Nota: 'unsafe-inline' se incluye temporalmente para desarrollo.
        // En producción se recomienda eliminarlo para mayor seguridad.
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        // A07: Evitar que el sitio sea embebido en otros (clickjacking)
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
      },
    })
  );

  // A01: Configuración restrictiva de CORS
  app.enableCors({
    origin: ['http://localhost:3001'], // Solo se permite este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  await app.listen(3000);
}

bootstrap();
