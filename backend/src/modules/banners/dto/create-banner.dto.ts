import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty({ message: 'El título del banner es obligatorio.' })
  title!: string;

  @IsOptional()
  @IsString()
  highlightedTitle?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsString()
  @IsNotEmpty({ message: 'La imagen del banner es obligatoria.' })
  image!: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  buttonText?: string;

  @IsOptional()
  benefits?: unknown;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
