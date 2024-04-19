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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
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
import { CurrentUser } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ticket' })
  @ApiResponse({ status: 201, description: 'Ticket creado con éxito' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './src/uploads/ticket/img',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() createTicketDto: CreateTicketDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createTicketDto.image = file.filename;
    }
    if (!createTicketDto.image) {
      delete createTicketDto.image;
    }
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tickets' })
  @ApiResponse({ status: 200, description: 'Lista de tickets' })
  @UseGuards(AuthGuard)
  findAll( @CurrentUser() user: User) {
    console.log(user); // ACA TENGO LOS DATOS DEL USUARIO
    return this.ticketsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ticket por ID' })
  @ApiResponse({ status: 200, description: 'Ticket encontrado' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del ticket' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ticket' })
  @ApiResponse({ status: 200, description: 'Ticket actualizado con éxito' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del ticket' })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
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

