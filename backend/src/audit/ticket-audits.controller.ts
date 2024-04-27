import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketAuditsService } from './ticket-audits.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

// FALTA HACER MODULE Y SERVICE
//import { TicketsAuditService } from "./tickets-audit.service";

@ApiTags('Ticket Audits')
@Controller('ticket-audits')
export class TicketAuditsController {
    constructor(private readonly ticketAuditsService: TicketAuditsService) { }

    // Obtiene todos los registros.
    @Get(':id')
    @ApiOperation({
        summary: 'Obtener todos los registros de auditoría de un ticket',
    })
    @ApiResponse({ status: 200, description: 'Lista de registros de auditoría' })
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    findAll(@Param('id') id: number) {
        try {
            return this.ticketAuditsService.findAll(id);
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Hubo un problema al obtener los registros de auditoría.',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}


// CODE MODIFIED V1.1
// import { Controller, Get, Post, Body, UseGuards, Param, Delete, Patch } from "@nestjs/common";
// import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
// import { TicketAuditsService } from "./ticket-audits.service";
// import { AuthGuard } from "src/auth/auth.guard";
// import { Role } from "src/auth/enums/role.enum";
// import { Roles } from "src/auth/decorators/roles.decorator";
// import { TicketAuditDto } from "src/audit/dto/ticket-audit-dto";

// @ApiTags("Ticket Audits")
// @Controller("ticket-audits")
// export class TicketAuditsController {
//     constructor(private readonly ticketAuditsService: TicketAuditsService) { }

//     @Get(':id')
//     @ApiOperation({ summary: "Obtener todos los registros de auditoría de tickets" })
//     @ApiResponse({ status: 200, description: "Lista de registros de auditoría" })

//     @UseGuards(AuthGuard)
//     @Roles(Role.ADMIN)
//     findAll(@Param('id') id: number) {
//         return this.ticketAuditsService.findAll(id);
//     }

//     @Post()
//     @ApiOperation({ summary: "Crear un nuevo registro de auditoría de ticket" })
//     @ApiResponse({ status: 201, description: "Registro de auditoría creado con éxito" })

//     @UseGuards(AuthGuard)
//     @Roles(Role.ADMIN)
//     async create(@Body() ticketAuditDto: TicketAuditDto) {
//         return await this.ticketAuditsService.create(ticketAuditDto);
//     }

//     @Patch(':id')
//     @ApiOperation({ summary: "Actualizar un registro de auditoría de ticket" })
//     @ApiResponse({ status: 200, description: "Registro de auditoría actualizado con éxito" })

//     @UseGuards(AuthGuard)
//     @Roles(Role.ADMIN)
//     async update(@Param('id') id: string, @Body() ticketAuditDto: TicketAuditDto) {
//         return await this.ticketAuditsService.update(parseInt(id), ticketAuditDto);
//     }

//     @Delete(':id')
//     @ApiOperation({ summary: "Eliminar un registro de auditoría de ticket" })
//     @ApiResponse({ status: 200, description: "Registro de auditoría eliminado con éxito" })

//     @UseGuards(AuthGuard)
//     @Roles(Role.ADMIN)
//     async remove(@Param('id') id: string) {
//         return await this.ticketAuditsService.remove(parseInt(id));
//     }
 
// }