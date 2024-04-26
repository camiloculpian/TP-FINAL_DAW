// import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { TicketsService } from './tickets.service';
// import { CreateTicketDto } from './dto/create-ticket.dto';
// import { UpdateTicketDto } from './dto/update-ticket.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// @Controller('tickets')
// export class TicketsController {
//   constructor(private readonly ticketsService: TicketsService) {}

//   @Post()
//   @UseInterceptors(FileInterceptor('image', {
//     storage: diskStorage({
//       destination: './src/uploads/ticket/img',
//       filename: (req, file, cb) => {
//         const randomName = Array(32).fill(null).map(()=>(Math.round(Math.random()*16)).toString(16)).join('');
//         return cb(null, `${randomName}${extname(file.originalname)}`);
//       },
//     }),
//   }))
//   create(@Body() createTicketDto: CreateTicketDto, @UploadedFile() file: Express.Multer.File){
//     if(file){
//       createTicketDto.image = file.filename;
//     }
//     if(!createTicketDto.image){
//       delete createTicketDto.image;
//     }
//     return this.ticketsService.create(createTicketDto);
//   }

//   @Get()
//   findAll() {
//     return this.ticketsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.ticketsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
//     return this.ticketsService.update(+id, updateTicketDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.ticketsService.remove(+id);
//   }
// }


// tickets modified v1.1
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, NotFoundException, Inject } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { Ticket } from './entities/ticket.entity';
import { UsersService } from 'src/users/users.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }
  @Inject(UsersService)
    private readonly userService: UsersService

  @Post()
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
                  const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
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
      })
  )
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  async create(
      @Body() createTicketDto: CreateTicketDto,
      @UploadedFile() archive: Express.Multer.File,
      @CurrentUser('sub') userId: number
  ) {
      if (archive) {
          createTicketDto.archive = archive.filename;
      }
      const newTicket = await this.ticketsService.create(createTicketDto, userId);
      return newTicket;
  }
  
  @Get()
  @ApiOperation({ summary: 'Obtener todos los tickets' })
  @ApiResponse({ status: 200, description: 'Lista de tickets' })
  @UseGuards(AuthGuard)
  findAll( @CurrentUser('sub') userId: number) {
    console.log(userId); // ACA TENGO LOS DATOS DEL USUARIO
    return this.ticketsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ticket por ID' })
  @ApiResponse({ status: 200, description: 'Ticket encontrado' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del ticket' })
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: number) {
    return this.ticketsService.findOne(+id, +userId);
  }

  @Patch(':id')
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
                  const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
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
      })
  )
  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async update(
      @Param('id') id: string,
      @Body() updateTicketDto: UpdateTicketDto,
      @UploadedFile() archive: Express.Multer.File,
      @CurrentUser('sub') userId: number
  ) {
      if (archive) {
          updateTicketDto.archive = archive.filename;
      }
      
      const updatedTicket = await this.ticketsService.update(+id, updateTicketDto, userId);
  
      return updatedTicket;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ticket' })
  @ApiResponse({ status: 200, description: 'Ticket eliminado con éxito' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del ticket' })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}

