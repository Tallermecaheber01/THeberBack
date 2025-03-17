import { IsEmail, IsNotEmpty } from "class-validator";

// login.dto.ts
export class LoginDto {
    @IsEmail({}, { message: "El correo no es válido" })
    correo: string;

    @IsNotEmpty({ message: "La contraseña es obligatoria" })
    contrasena: string;
}
