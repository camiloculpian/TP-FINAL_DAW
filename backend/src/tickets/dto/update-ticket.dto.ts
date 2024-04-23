import { PartialType } from '@nestjs/mapped-types';
import { Transform } from "class-transformer";
import { CreateTicketDto } from './create-ticket.dto';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { TicketPriority, TicketsService, TicketStatus } from "../entities/ticket.entity";

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @Transform(({value}) => value.trim())
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

    @IsOptional()
    assignedToUserId?: number;

    @IsOptional()
    archive?: string;
}
