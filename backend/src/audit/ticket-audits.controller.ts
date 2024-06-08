import {
    Controller,
    Get,
    UseGuards,
    Param,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketAuditsService } from './ticket-audits.service';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { Response, responseStatus } from '../common/responses/responses';


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
    async findAll(@Param('id') id: number) {
        try {
            return new Response({
                statusCode:201,
                status:responseStatus.OK,
                message:'Audit of Ticket ID: '+id,
                data: await this.ticketAuditsService.findAll(id)
            });
        } catch (error) {
            console.error('Error al obtener registros:', error);
            throw new BadRequestException ({'status':'ERROR','message':error.message,'statusCode':error.statusCode});
        }
    }
}
