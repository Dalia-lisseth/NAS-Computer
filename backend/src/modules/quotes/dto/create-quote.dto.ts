import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { CreateQuoteItemDto } from './create-quote-item.dto';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio.' })
  customerName!: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  customerEmail!: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsArray({ message: 'Los items deben ser un arreglo.' })
  @ArrayMinSize(1, { message: 'La cotización debe tener al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items!: CreateQuoteItemDto[];
}
