import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { TicketAudit } from '../entities/ticket-audits.entity';

export class TicketAuditDto extends PartialType(TicketAudit) {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  campo?: string;
}

// FALTA HACER MODULE Y SERVICE
