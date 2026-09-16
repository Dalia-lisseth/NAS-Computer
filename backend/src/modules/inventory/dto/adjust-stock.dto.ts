import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AdjustStockDto {
  @IsString()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  productId!: string;

  @Type(() => Number)
  @IsInt({ message: 'El nuevo stock debe ser un número entero.' })
  @Min(0, { message: 'El nuevo stock no puede ser negativo.' })
  newStock!: number;

  @IsString()
  @IsNotEmpty({ message: 'El motivo del ajuste es obligatorio.' })
  reason!: string;
}
