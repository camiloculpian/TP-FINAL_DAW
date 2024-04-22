import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UpdateUserRolesDto } from './dto/update-userRoles.dto ';
import { AuthGuard } from '../auth/auth.guard';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/decorators/currentUser.decorator'; // Agrega la ruta correcta


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuario creado con éxito' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  @ApiBody({ type: CreateUserDto })
  //@UseGuards(AuthGuard)
  //@Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads/users',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(()=>(Math.round(Math.random()*16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createUserDto.profilePicture = file.filename;
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado con éxito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiBody({ type: UpdateUserDto })
  // subida de archivos
  @UseInterceptors(FileInterceptor('profilePicture', {
      storage: diskStorage({
          destination: './uploads/users',
          filename: (req, file, cb) => {
              const randomName = Array(32).fill(null).map(()=>(Math.round(Math.random()*16)).toString(16)).join('');
              cb(null, `${randomName}${extname(file.originalname)}`);
          },
      }),
  }))
  @UseGuards(AuthGuard)
  update(
      @Param('id') id: number,
      @Body() updateUserDto: UpdateUserDto,
      @CurrentUser() currentUser: any,
      @UploadedFile() file: Express.Multer.File
  ) {    
    // si es administrador
      if (file) {
          updateUserDto.profilePictureF = file.filename;
      }
  
      if (currentUser.role === Role.ADMIN) {
          return this.usersService.update(+id, updateUserDto);
      } else if (currentUser.id === id) {
          const allowedUpdates = {
              password: updateUserDto.password, //Si el usuario es el mismo que se está actualizando, solo permite password y profilePicture
              profilePicture: updateUserDto.profilePicture,
          };
          return this.usersService.update(+id, allowedUpdates);
      } else {
          throw new Error('No tienes permiso para modificar a este usuario');
      }
  }
  
  // Solo permite a administradores cambiar los roles de usuario
  @Patch(':id/role')
  @ApiOperation({ summary: 'Actualizar el rol de un usuario' })
  @ApiResponse({ status: 200, description: 'Rol del usuario actualizado con éxito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiBody({ type: UpdateUserRolesDto })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN) 
  updateUserRole(
      @Param('id') id: number,
      @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
      return this.usersService.updateRole(id, updateUserRolesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado con éxito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}