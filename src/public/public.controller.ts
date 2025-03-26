import { LoginService } from './login/login.service';
import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { RegisterService } from './register/register.service';
import { CreateClientDto } from './register/dto/create-client-dto';
import { LoginDto } from './login/dto/login-dto';
import { Response } from 'express';
import { UserViewEntity } from './information/view/vw-users-entity';
import { InformationService } from './information/information.service';
import { RecoverPasswordService } from './recover-password/recover-password.service';
import { RoleGuard } from 'src/role/guards/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { AuthGuard } from 'src/role/guards/authguard/authguard.guard';

@Controller('public')
export class PublicController {
    constructor(
        private readonly registerService: RegisterService,
        private readonly loginService: LoginService,
        private readonly informationService: InformationService,
        private readonly recoverPasswordService: RecoverPasswordService
    ) { }

    // Endpoint para enviar el código de verificación
    @Post('register/send-verification-code')
    async sendVerificationCode(@Body('correo') correo: string): Promise<string> {
        return this.registerService.sendVerificationCode(correo);
    }

    // Endpoint para verificar el código de verificación
    @Post('register/verify-code')
    async verifyCode(@Body() data: { correo: string; code: string }) {
        const { correo, code } = data;
        return this.registerService.verifyCode(correo, code);
    }


    // Endpoint para registrar un nuevo usuario
    @Post('register')
    async register(@Body() createClientDto: CreateClientDto): Promise<any> {
        return this.registerService.createUser(createClientDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        return this.loginService.login(loginDto, res);
    }

    @Get(':email')
    @Roles('administrador', 'cliente')
    @UseGuards(AuthGuard, RoleGuard)  // Primero AuthGuard para verificar el token
    async getUserByEmail(@Param('email') email: string): Promise<UserViewEntity> {
        return this.informationService.getUserByEmail(email);
    }



    @Get(':email/role')
    async getUserRoleById(@Param('email') email: string): Promise<UserViewEntity> {
        return this.informationService.getUserRoleByEmail(email);
    }


    // Buscar usuario por correo
    @Post('recover-password/find-user')
    async findUserByEmail(@Body('correo') correo: string): Promise<{ success: boolean }> {
        return this.recoverPasswordService.findUserByEmail(correo);
    }

    @Post('recover-password/send-verification-code')
    async sendPasswordResetVerificationCode(
        @Body('correo') correo: string,
        @Body('idPreguntaSecreta') idPreguntaSecreta: number,
        @Body('respuestaSecreta') respuestaSecreta: string
    ): Promise<string> {
        return this.recoverPasswordService.sendPasswordResetVerificationCode(
            correo,
            idPreguntaSecreta,
            respuestaSecreta
        );
    }

    // Endpoint para verificar el código de verificación para restablecer la contraseña
    @Post('recover-password/verify-code')
    async verifyPasswordResetCode(@Body() data: { correo: string, code: string }): Promise<string> {
        const { correo, code } = data;
        return this.recoverPasswordService.verifyPasswordResetCode(correo, code);
    }

    // Endpoint para restablecer la contraseña
    @Post('recover-password/reset')
    async resetPassword(@Body() data: { correo: string, newPassword: string }): Promise<string> {
        const { correo, newPassword } = data;
        return this.recoverPasswordService.resetPassword(correo, newPassword);
    }

    @Get('questions/secret')
    async getAllQuestions() {
        return this.registerService.getAllQuestions();
    }
}
