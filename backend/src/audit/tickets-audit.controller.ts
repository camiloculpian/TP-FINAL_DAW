import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { TicketAuditDto } from "src/audit/ticket-audit-dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
// FALTA HACER MODULE Y SERVICE
//import { TicketsAuditService } from "./tickets-audit.service";

@ApiTags("Tickets Audit")
@Controller("tickets-audit")
export class TicketsAuditController {
    constructor(private readonly ticketsAuditService: TicketsAuditService) { }

    @Get()
    @ApiOperation({ summary: "Obtener todos los registros de auditoría de tickets" })
    @ApiResponse({ status: 200, description: "Lista de registros de auditoría" })


    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    findAll() {
        return this.ticketsAuditService.findAll();
    }

    @Post()
    @ApiOperation({ summary: "Crear un nuevo registro de auditoría de ticket" })
    @ApiResponse({ status: 201, description: "Registro de auditoría creado con éxito" })

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    create(
        @Body() ticketAuditDto: TicketAuditDto
    ) {
        return this.ticketsAuditService.create(ticketAuditDto);
    }
}
