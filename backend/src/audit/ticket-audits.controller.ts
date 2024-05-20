import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
    HttpException,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketAuditsService } from './ticket-audits.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Response, responseStatus } from 'src/common/responses/responses';


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
