import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString() @MinLength(2) @MaxLength(160) name!: string;
  @IsOptional() @IsString() @MaxLength(180) slug?: string;
  @IsOptional() @IsString() @MaxLength(3000) description?: string;
  @IsOptional() @IsString() @MaxLength(2000) image?: string;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price!: number;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) previousPrice?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) stock?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) minimumStock?: number;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 1 }) @Min(0) rating?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) reviewCount?: number;
  @IsOptional() @IsString() @MaxLength(30) badge?: string;
  @IsOptional() @IsObject() specifications?: Record<string, string>;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsString() categoryId!: string;
}
