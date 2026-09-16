import { IsBoolean } from 'class-validator';

export class UpdateStatusDto {
  @IsBoolean({ message: 'El campo isActive debe ser un valor booleano.' })
  isActive!: boolean;
}
