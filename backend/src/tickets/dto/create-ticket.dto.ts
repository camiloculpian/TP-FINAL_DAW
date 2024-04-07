import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsString } from "class-validator";
import { TicketPriority, TicketsService, TicketStatus } from "../entities/ticket.entity";

export class CreateTicketDto {
    @Transform(({value}) => value.trim())
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsEnum(TicketPriority)
    priority: TicketPriority;

    @IsEnum(TicketStatus)
    status: TicketStatus;

    @IsEnum(TicketsService)
    service: TicketsService;

    @IsDateString()
    createDate: Date;

    @IsBoolean()
    isActive: boolean;

    //quien lo asigno
    @IsString()
    createName: string;

    @IsDateString()
    lastModified: Date

}
