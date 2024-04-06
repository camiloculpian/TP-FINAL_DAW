import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsHash, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength, minLength } from "class-validator";

// Pioridad
enum TicketPriority{
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

//  Estado del ticket
enum TicketStatus{
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}

// A que servicio pertenece (se puede considerar ya que creando al usuario se podria asignar el rol o a que parte de departamento pertenece y que se filtren por ahi)
enum TicketsService {
    TRANSPORTATION = "TRANSPORTATION",
    STORAGE = "STORAGE",
    DISTRIBUCION = "DISTRIBUTION",
    CUSTOMS = "CUSTOMS",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE"
}
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

    @IsDateString()
    createDate: Date;

    @IsBoolean()
    isActive: boolean;

    //quien lo asigno
    @IsString()
    createName: string;

    @IsEnum(TicketsService)
    departament: TicketsService;

}
