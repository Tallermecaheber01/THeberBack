import { Injectable } from '@nestjs/common';
import { format, createLogger, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
    private logger: Logger;

    constructor() {
        this.createLogger();
        this.replaceConsole();
    }

    /**
     * Crea un solo logger para todos los niveles de logs
     */
    createLogger() {
        const plainTextFormat = format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message, ...meta }) => {
                const metaString = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
                return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}`;
            })
        );

        this.logger = createLogger({
            format: plainTextFormat,
            transports: [
                new transports.DailyRotateFile({
                    filename: 'logs/app-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '90d'
                }),
                new transports.Console()
            ]
        });
    }

    /**
     * Reemplaza console.log, console.error y console.warn para que se registren en los logs
     */
    replaceConsole() {
        console.log = (message: any, params?: any) => {
            this.logger.info(message, params);
        };

        console.error = (message: any, params?: any) => {
            this.logger.error(message, params);
        };

        console.warn = (message: any, params?: any) => {
            this.logger.warn(message, params);
        };
    }

    /**
     * Métodos de logging personalizados
     */
    log(message: string, context?: any) {
        this.logger.info(message, context);
    }

    error(message: string, context?: any) {
        this.logger.error(message, context);
    }

    warn(message: string, context?: any) {
        this.logger.warn(message, context);
    }

    /**
     * Registra acciones en la base de datos en el mismo archivo de log
     */
    logDbAction(accion: string, tabla: string, descripcion: string | null, usuario: string, ip: string) {
        this.logger.info(
            `Acción en la base de datos: ${accion} en ${tabla}`,
            {
                descripcion: descripcion || "No hay descripción",
                usuario,
                ip_usuario: ip
            }
        );
    }
}
