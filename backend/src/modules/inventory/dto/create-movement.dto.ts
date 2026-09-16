import { InventoryMovementType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateMovementDto {
  @IsString()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  productId!: string;

  @IsEnum(InventoryMovementType, {
    message: 'El tipo de movimiento debe ser ENTRY, EXIT o ADJUSTMENT.'
  })
  type!: InventoryMovementType;

  @Type(() => Number)
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0.' })
  quantity!: number;

  @IsString()
  @IsNotEmpty({ message: 'El motivo del movimiento es obligatorio.' })
  reason!: string;
}
