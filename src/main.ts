import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as fs from 'fs';
import { LoggerService } from './services/logger/logger.service';

async function bootstrap() {

  let httpsOptions = undefined;

  if (process.env.NODE_ENV === 'production') {
    httpsOptions = undefined; // Render ya pone HTTPS
  } else {
    httpsOptions = {
      key: fs.readFileSync('certs/key.pem'),
      cert: fs.readFileSync('certs/cert.pem'),
    };
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: new LoggerService(),
  });

  // Seguridad global
  app.use(helmet());
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.use(helmet.noSniff());
  app.use(helmet.frameguard({ action: 'deny' }));

  // CSP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'", "https://theberback.onrender.com"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
        },
      },
      frameguard: { action: "deny" },
      noSniff: true,
    })
  );

  // CORS
  app.enableCors({
    origin: [
      "https://therberfront.onrender.com",
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:52419",
      "https://wheat-starling-827872.hostingersite.com",
      "https://buildpwa.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    credentials: true,
  });

  // Estáticos
  app.use('/static', (req, res, next) => {
    const allowedOrigins = [
      'https://therberfront.onrender.com',
      'http://localhost:3001',
      'https://wheat-starling-827872.hostingersite.com',
      'https://buildpwa.onrender.com',
      'http://localhost:3000',
      
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    next();
  });

  app.use(cookieParser());

  const logger = app.get(LoggerService);

  try {
    await app.listen(process.env.PORT || 3000, "0.0.0.0");
    logger.log("La aplicación se ha arrancado correctamente", "Bootstrap");
  } catch (error) {
    logger.error("Error arrancando la aplicación", error);
  }
}

bootstrap();
