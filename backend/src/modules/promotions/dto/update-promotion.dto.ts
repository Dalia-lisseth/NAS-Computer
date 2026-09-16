import { DiscountType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DiscountType, { message: 'El tipo de descuento debe ser PERCENTAGE o FIXED.' })
  discountType?: DiscountType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'El valor de descuento debe ser positivo.' })
  discountValue?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
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
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}
