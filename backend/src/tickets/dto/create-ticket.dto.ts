import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { TicketPriority, TicketsService, TicketStatus } from "../entities/ticket.entity";

export class CreateTicketDto {
    @Transform(({value}) => value.trim())
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @IsEnum(TicketsService)
    service: TicketsService;

    @IsOptional()
    assignedToUserId?: number;

}
