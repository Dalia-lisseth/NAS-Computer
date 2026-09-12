import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';

export class UpdateProductDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) name?: string;
  @IsOptional() @IsString() @MaxLength(180) slug?: string;
  @IsOptional() @IsString() @MaxLength(3000) description?: string;
  @IsOptional() @IsString() @MaxLength(2000) image?: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price?: number;
  @IsOptional() @Transform(({ value }) => (value === null || value === '' ? null : Number(value))) @ValidateIf((_, v) => v !== null) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) previousPrice?: number | null;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) stock?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) minimumStock?: number;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 1 }) @Min(0) rating?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) reviewCount?: number;
  @IsOptional() @Transform(({ value }) => (value === null || value === '' ? null : String(value))) @ValidateIf((_, v) => v !== null) @IsString() @MaxLength(30) badge?: string | null;
  @IsOptional() @ValidateIf((_, v) => v !== null) @IsObject() specifications?: Record<string, any> | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() categoryId?: string;
}
