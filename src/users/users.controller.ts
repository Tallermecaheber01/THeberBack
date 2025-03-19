import { Body, Controller, Get, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegistroService } from './registro/registro.service';
import { User } from './entity/user.entity';
import { LoginDto } from './login/login.dto';
import { LoginService } from './login/login.service';
import { RecoverPasswordService } from './recover-password/recover-password.service';
import { FeedbackService } from './feedback/feedback.service';
import { CreateFeedbackDto } from './feedback/feedback.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(
        private readonly registroService: RegistroService,
        private readonly loginService : LoginService,
        private readonly recoverPasswordService: RecoverPasswordService,
        private readonly feedbackService: FeedbackService,  
    ){}

    @Post('register')
    async create(@Body() userData: User):Promise<User>{
        return this.registroService.createUser(userData)
    }

    //Endpoint para enviar el codigo de verificacion al correo del usuario
    @Post('register/send-code')
    async sendVerificationCode2(@Body('correo') email:string):Promise<string>{
        return this.registroService.sendVerificationCode2(email);
    }

    //Endopont para verificar el codigo recibido por el usuario
    @Post('register/verify-code')
    async verifyCode2(@Body() body: {email:string; code:string}):Promise<string>{
        const {email,code}=body;
        return this.registroService.verifyCode(email,code);
    }
 

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res:Response){
        return this.loginService.login(loginDto, res);
    }

    //Endpoint para enviar el codigo de verificacion al correo del usuario
    @Post('recover-password/send-code')
    async sendVerificationCode(@Body('correo') email:string):Promise<string>{
        return this.recoverPasswordService.sendVerificationCode(email);
    }

    //Endopont para verificar el codigo recibido por el usuario
    @Post('recover-password/verify-code')
    async verifyCode(@Body() body: {email:string; code:string}):Promise<string>{
        const {email,code}=body;
        return this.recoverPasswordService.verifyCode(email,code);
    }

    //Endpoint para cambiar la contraseña despues de verificar el codigo
    @Post('recover-password/reset')
    async resetPassword(@Body() body: {email:string; newPassword: string}):Promise<string>{
        const {email,newPassword}=body;
        return this.recoverPasswordService.resetPassword(email,newPassword);
    }

    @Post('feedback')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Aplica validaciones
  async createFeedback(@Body() feedbackData: CreateFeedbackDto) {
    return this.feedbackService.crearFeedback(feedbackData);
  }
 
     // Nuevo endpoint para obtener todos los feedbacks
     @Get('feedback')
     async getFeedback() {
         return this.feedbackService.obtenerTodos();
     }


}
