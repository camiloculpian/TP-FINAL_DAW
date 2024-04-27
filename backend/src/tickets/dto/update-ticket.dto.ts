import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { CreateTicketDto } from './create-ticket.dto';
import {
    IsEnum,
    IsNumberString,
    IsOptional,
    IsString,
} from 'class-validator';
import {
    TicketPriority,
    TicketsService,
    TicketStatus,
} from '../entities/ticket.entity';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @IsEnum(TicketsService)
    @IsOptional()
    service?: TicketsService;

    @IsNumberString()
    @IsOptional()
    asignedToUserId?: number;

    @IsOptional()
    archive?: string;

    @IsEnum(TicketStatus)
    @IsOptional()
    status?: TicketStatus;
}
