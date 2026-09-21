import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres.' })
  name!: string;

  @IsEmail({}, { message: 'Por favor ingresa un correo electrónico válido.' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(/[a-z]/, { message: 'La contraseña debe incluir al menos una letra minúscula.' })
  @Matches(/[A-Z]/, { message: 'La contraseña debe incluir al menos una letra mayúscula.' })
  @Matches(/\d/, { message: 'La contraseña debe incluir al menos un número.' })
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}
