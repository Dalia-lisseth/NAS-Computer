import { QuoteStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateQuoteStatusDto {
  @IsEnum(QuoteStatus, {
    message: 'El estado debe ser PENDING, IN_PROGRESS, CONTACTED, CLOSED o CANCELLED.'
  })
  status!: QuoteStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
