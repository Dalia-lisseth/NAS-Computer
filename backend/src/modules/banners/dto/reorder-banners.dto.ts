import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class ReorderBannersDto {
  @IsArray({ message: 'bannerIds debe ser un arreglo con los identificadores en orden.' })
  @ArrayMinSize(1, { message: 'Debes enviar al menos un identificador.' })
  @IsString({ each: true })
  bannerIds!: string[];
}
