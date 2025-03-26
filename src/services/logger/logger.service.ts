import { Injectable } from '@nestjs/common';
import { format, createLogger, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {

    private loggerInfo: Logger;
    private loggerError: Logger;
    private loggerWarn: Logger;
    private loggerAll: Logger;

    constructor() {
        this.createLoggers();
        this.replaceConsole();
    }

    /**
     * Crea los loggers
     */
    createLoggers() {

        // Formato de texto
        const textFormat = format.printf((log) => {
            const { timestamp, level, message, ...metadata } = log;
            let logMessage = `${timestamp} - [${level.toUpperCase().charAt(0)}] ${message}`;
            
            // Agregar metadatos adicionales si existen
            if (Object.keys(metadata).length > 0) {
                logMessage += ` - ${JSON.stringify(metadata)}`;
            }

            return logMessage;
        });

        // Formato de fecha
        const dateFormat = format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        });

        // Logger de info
        this.loggerInfo = createLogger({
            level: 'info',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: 'logs/info/info-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d'
                })
            ]
        });

        // Logger de error
        this.loggerError = createLogger({
            level: 'error',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: 'logs/error/error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d'
                })
            ]
        });

        // Logger de warn
        this.loggerWarn = createLogger({
            level: 'warn',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: 'logs/warn/warn-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d'
                })
            ]
        });

        // Logger donde almacenamos todo, ademas de la consola
        this.loggerAll = createLogger({
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: 'logs/all/all-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d'
                }),
                new transports.Console()
            ]
        });
    }

    /**
     * Remplaza la funcionalidad de los console.log, console.error y console.warn
     */
    replaceConsole() {

        // console.log
        console.log = (message: any, params: any) => {
            const context = this.createContext(params);
            this.loggerInfo.info(message, context);
            this.loggerAll.info(message, context);
        }

        // console.error
        console.error = (message: any, params: any) => {
            const context = this.createContext(params);
            this.loggerError.error(message, context);
            this.loggerAll.error(message, context);
        }

        // console.warn
        console.warn = (message: any, params: any) => {
            const context = this.createContext(params);
            this.loggerWarn.warn(message, context);
            this.loggerAll.warn(message, context);
        }
    }

    // Métodos para loguear mensajes con contexto

    log(message: string, context?: any) {
        const logContext = this.createContext(context);
        this.loggerInfo.info(message, logContext);
        this.loggerAll.info(message, logContext);
    }

    error(message: string, context?: any) {
        const logContext = this.createContext(context);
        this.loggerError.error(message, logContext);
        this.loggerAll.error(message, logContext);
    }

    warn(message: string, context?: any) {
        const logContext = this.createContext(context);
        this.loggerWarn.warn(message, logContext);
        this.loggerAll.warn(message, logContext);
    }

    // Crear contexto con información adicional (usuario, petición, etc.)
    private createContext(params?: any) {
        const context: any = {};

        if (params) {
            if (params.userId) context.userId = params.userId;  // ID de usuario si se proporciona
            if (params.file) context.file = params.file;  // Archivo donde ocurrió el error
            if (params.line) context.line = params.line;  // Línea donde ocurrió el error
        }

        return context;
    }

    debug(message: string) { }

    verbose(message: string) { }

}
