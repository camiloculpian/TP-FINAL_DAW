import { Transform } from 'class-transformer';
import {
    IsEnum,
    IsNumberString,
    IsOptional,
    IsString,
} from 'class-validator';
import {
    TicketPriority,
    TicketsService,
} from '../entities/ticket.entity';

export class CreateTicketDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @IsEnum(TicketsService)
    service: TicketsService;

    @IsNumberString()
    asignedToUserId: number;

    @IsOptional()
    archive?: string;
}
