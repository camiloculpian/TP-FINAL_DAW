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
    Query,
    HttpStatus,
    HttpException,
    ImATeapotException,
    NotImplementedException,
    BadRequestException
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
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
import { TicketStatus } from '../tickets/entities/ticket.entity';
import { Response, responseStatus } from 'src/common/responses/responses';
import { I18nContext, I18nService } from 'nestjs-i18n';

//TO-DO aca tengo que tomar lo que devuelve el service y crear una Response. Proncipio SOLID

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
    constructor(
        private readonly ticketsService: TicketsService,
        private readonly i18n: I18nService
    ) { }
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
        // MANEJO DE ERRORES Y RESPUESTAS
        // las respuestas es sencillo pq las devolvemos con una instancia de la clase Response
        // las excepciones deberiamos devolverlas en dos tipos: 
        //
        //      -las previstas, o sea las que lanzamos nosotros por ej. no esta autorizado o algun otro chequeo las definimos en el SERVICIO!!!!
        //          y deben de tener la forma por ej. throw new BadRequestException({status:responseStatus.ERROR,message:'User who you wants to asign the ticket not exist!'});
        //
        //      -las no previstas, o sea por ej se corto la comunicacion con el servicio de la base de datos o los chequeos del dto solo lanzamos 'e'!!!
        try {
            if (archive) {
                createTicketDto.archive = archive.filename;
            }
            const ticket = await this.ticketsService.create(
                createTicketDto,
                userId,
            );
            return new Response({
                statusCode:201,
                status:responseStatus.OK,
                message:this.i18n.t('lang.tickets.CreateOK',{args: { id: ticket.id },lang: I18nContext.current().lang}),
                data:ticket
            });
        } catch (e) {
            throw new BadRequestException({status:responseStatus.ERROR,message:e.message})
        }
    }
    
    // Obtiene todos los tickets de un usuario. Filtros: id de usuario asignado, status, service
    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Obtener todos los tickets' })
    @ApiResponse({ status: 200, description: 'Lista de tickets' })
    async findAll(
      @CurrentUser('sub') userId: number,
      @Query('service') service?: string,
      @Query('status') status?: TicketStatus,
      @Query('assignedToUserId') assignedToUserId?: number,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
    ) {
        try {
            return new Response({
                statusCode:201,
                status:responseStatus.OK,
                message: "OK",
                data: await this.ticketsService.findAll(userId, service, status, assignedToUserId, page, limit),
            });
        } catch (e) {
            throw new BadRequestException({status:responseStatus.ERROR,message:e.message});
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
            return await this.ticketsService.findOne(+id, userId);
        } catch (e) {
            throw new BadRequestException({status:responseStatus.ERROR,message:e.message});
        }
    }

    // Actualiza los tickets: un usuario ADMIN puede actualizar TODOS los campos y un USER solo descripcion, archive y status 
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
                return new Response({
                    statusCode:201,
                    status:responseStatus.OK,
                    message: `Ticket #${id} actualizado correctamente`,
                    data: await this.ticketsService.update(+id, updateTicketDto, userId,)
                });
        } catch (e) {
            throw new BadRequestException({status:responseStatus.ERROR,message:e.message});
        }
    }

    // Elimina un ticket: solo ADMIN
    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Eliminar un ticket' })
    @ApiResponse({ status: 200, description: 'Ticket eliminado con éxito' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    @ApiParam({ name: 'id', description: 'ID único del ticket' })
    async remove(@Param('id') id: string) {
        try {
            return await this.ticketsService.remove(+id);
        } catch (e) {
            throw e;
        }
    }
}
