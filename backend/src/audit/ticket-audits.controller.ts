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
        summary: 'Obtener todos los registros de auditoría de tickets',
    })
    @ApiResponse({ status: 200, description: 'Lista de registros de auditoría' })
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    findAll(@Param('id') id: string) {
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

    // @Post()
    // @ApiOperation({ summary: "Crear un nuevo registro de auditoría de ticket" })
    // @ApiResponse({ status: 201, description: "Registro de auditoría creado con éxito" })

    // @UseGuards(AuthGuard)
    // @Roles(Role.ADMIN)
    // create(
    //     @Body() ticketAuditDto: TicketAuditDto
    // ) {
    //     return this.ticketsAuditService.create(ticketAuditDto);
    // }
}
