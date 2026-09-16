import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Por favor ingresa un correo electrónico válido.' })
  email!: string;

  @IsString()
  @MinLength(1, { message: 'Por favor ingresa la contraseña.' })
  password!: string;
}
