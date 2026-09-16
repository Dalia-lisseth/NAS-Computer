import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateQuoteItemDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio.' })
  productName!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio unitario debe ser un número válido.' })
  @IsPositive({ message: 'El precio unitario debe ser mayor a 0.' })
  unitPrice!: number;

  @Type(() => Number)
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser al menos 1.' })
  quantity!: number;
}
