import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UpdateUserRolesDto } from './dto/update-userRoles.dto ';
import { AuthGuard } from '../auth/auth.guard';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //Creacion de Usuarios: Solo puede crear el administrador 
  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado con éxito',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads-profiles/users',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        createUserDto.profilePicture = file.filename;
      }
      const newUser = await this.usersService.create(createUserDto);
      return newUser;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return {'status':'ERROR','message':error.message,'statusCode':error.statusCode};
    }
  }

  // Traer todos los usuarios
  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return users;
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      return {'status':'ERROR','message':error.message,'statusCode':error.statusCode};
    }
  }

  // Traer usuarios por ID
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.usersService.findOne(+id);
      return user;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return {'status':'ERROR','message':error.message,'statusCode':error.statusCode};
    }
  }

  // Actualizar usuarios: Admin (todos los campos) User (solo password, profilePicture and )
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado con éxito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads-profiles/users',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('sub') currentUser: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.usersService.update(id, updateUserDto, currentUser, file);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return {'status':'ERROR','message':error.message,'statusCode':error.statusCode};
    }
  }

  // Actualizar roles: solo tipo Admin
  @Patch(':id/role')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar el rol de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Rol del usuario actualizado con éxito',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiBody({ type: UpdateUserRolesDto })
  async updateUserRole(
    @Param('id') id: number,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
    try {
      return await this.usersService.updateRole(id, updateUserRolesDto);
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      return {'status':'ERROR','message':error.message,'statusCode':error.statusCode};
    }
  }

  // Eliminar usuario: rol Admin
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado con éxito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  async remove(@Param('id') id: number) {
    try {
      await this.usersService.remove(id);
      return { message: 'Usuario eliminado con éxito' };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return {'status':'ERROR','message':error.message,'statusCode':error.statusCode};
    }
  }
}
