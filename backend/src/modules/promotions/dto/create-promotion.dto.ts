import { DiscountType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la promoción es obligatorio.' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(DiscountType, { message: 'El tipo de descuento debe ser PERCENTAGE o FIXED.' })
  discountType!: DiscountType;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El valor de descuento debe ser un número válido.' })
  @IsPositive({ message: 'El valor de descuento debe ser positivo.' })
  discountValue!: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha ISO válida.' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha ISO válida.' })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  bannerText?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsArray({ message: 'Los productIds deben ser un arreglo de identificadores.' })
  @IsString({ each: true })
  productIds?: string[];
}
