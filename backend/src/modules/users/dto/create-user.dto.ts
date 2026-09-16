import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  name!: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'El rol debe ser CUSTOMER o ADMIN.' })
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
