import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    NotFoundException,
    Inject,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { UsersService } from 'src/users/users.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }
    @Inject(UsersService)
    private readonly userService: UsersService;

    // Crea un ticket: solo usuarios ADMIN
    @Post()
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo ticket' })
    @ApiResponse({ status: 201, description: 'Ticket creado con éxito' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @UseInterceptors(
        FileInterceptor('archive', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    // Verifica la extension y lo manda a su carpeta
                    const ext = extname(file.originalname).toLowerCase();
                    if (ext === '.pdf') {
                        cb(null, './src/uploads/ticket/pdf');
                    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
                        cb(null, './src/uploads/ticket/image');
                    } else {
                        cb(new Error('Tipo de archivo no soportado'), '');
                    }
                },
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                // Filtros
                const ext = extname(file.originalname).toLowerCase();
                if (ext === '.pdf' || ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            },
        }),
    )
    async create(
        @Body() createTicketDto: CreateTicketDto,
        @UploadedFile() archive: Express.Multer.File,
        @CurrentUser('sub') userId: number,
    ) {
        try {
            if (archive) {
                createTicketDto.archive = archive.filename;
            }
            const newTicket = await this.ticketsService.create(
                createTicketDto,
                userId,
            );
            return newTicket;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw new BadRequestException('Error creating ticket');
        }
    }
//Falta filtrar x criterios

    // Obtiene todos los tickets de un usuario
    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Obtener todos los tickets' })
    @ApiResponse({ status: 200, description: 'Lista de tickets' })
    async findAll(@CurrentUser('sub') userId: number) {
        try {
            return await this.ticketsService.findAll(userId);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw new InternalServerErrorException('Failed to fetch tickets');
        }
    }

    // Buscar tickets
    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Obtener un ticket por ID' })
    @ApiResponse({ status: 200, description: 'Ticket encontrado' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    @ApiParam({ name: 'id', description: 'ID único del ticket' })
    async findOne(@Param('id') id: string, @CurrentUser('sub') userId: number) {
        try {
            const ticket = await this.ticketsService.findOne(+id, userId);
            if (!ticket) {
                throw new NotFoundException('Ticket not found');
            }
            return ticket;
        } catch (error) {
            console.error(`Error fetching ticket with ID ${id}:`, error);
            throw new NotFoundException('Ticket not found');
        }
    }

    // Actualiza los tickets: un usuario ADMIN puede actualizar TODOS los campos y un USER solo descripcion, archive y status (REVISAR!)
    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Actualizar un ticket' })
    @ApiResponse({ status: 200, description: 'Ticket actualizado con éxito' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    @ApiParam({ name: 'id', description: 'ID único del ticket' })
    @UseInterceptors(
        FileInterceptor('archive', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const ext = extname(file.originalname).toLowerCase();
                    if (ext === '.pdf') {
                        cb(null, './src/uploads/ticket/pdf');
                    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
                        cb(null, './src/uploads/ticket/image');
                    } else {
                        cb(new Error('Tipo de archivo no soportado'), '');
                    }
                },
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname).toLowerCase();
                if (ext === '.pdf' || ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            },
        }),
    )
    async update(
        @Param('id') id: string,
        @Body() updateTicketDto: UpdateTicketDto,
        @UploadedFile() archive: Express.Multer.File,
        @CurrentUser('sub') userId: number,
    ) {
        try {
            if (archive) {
                updateTicketDto.archive = archive.filename;
            }
            const updatedTicket = await this.ticketsService.update(
                +id,
                updateTicketDto,
                userId,
            );
            if (!updatedTicket) {
                throw new NotFoundException('Ticket not found');
            }
            return updatedTicket;
        } catch (error) {
            console.error(`Error updating ticket with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to update ticket');
        }
    }

    // Elimina un ticket: solo ADMIN
    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Eliminar un ticket' })
    @ApiResponse({ status: 200, description: 'Ticket eliminado con éxito' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    @ApiParam({ name: 'id', description: 'ID único del ticket' })
    async remove(@Param('id') id: string) {
        try {
            const removedTicket = await this.ticketsService.remove(+id);
            if (!removedTicket) {
                throw new NotFoundException('Ticket not found');
            }
            return removedTicket;
        } catch (error) {
            console.error(`Error removing ticket with ID ${id}`, error);
            throw new NotFoundException('Ticket not found');
        }
    }
}
