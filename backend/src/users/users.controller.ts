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
  BadRequestException,
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
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Response, responseStatus } from '../common/responses/responses';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: 'src/config/config.env',
});

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService
  ) { }
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
        destination: process.env.USER_PROFILE_PICTURES_DIR,
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
      const data:any = await this.usersService.create(createUserDto);
      return new Response({
        statusCode:201,
        status:responseStatus.OK,
        message:this.i18n.t('lang.users.CreateOK',{args: { id: data.id }, lang:   I18nContext.current().lang }),
        data: data
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new BadRequestException ({'status':'ERROR','message':error.message,'statusCode':error.statusCode});
    }
  }

  
@Get()
@UseGuards(AuthGuard)
@ApiOperation({ summary: 'Obtener todos los usuarios' })
@ApiResponse({ status: 200, description: 'Lista de usuarios' })
async findAll(@CurrentUser("sub") userId: number) {
  try {
    const users = await this.usersService.findAll(userId);
    return new Response({
      statusCode: 200,
      status: responseStatus.OK,
      message: this.i18n.t('lang.users.ReadOK', { lang: I18nContext.current().lang}),
      data: users,
    });
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    throw new BadRequestException({
      'status': 'ERROR',
      'message': error.message,
      'statusCode': error.statusCode,
    });
  }
}
  // Trae Perfil del usuario por ID
  @Get('/profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener el perfil del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getProfile(@CurrentUser("sub") userId: number) {
    try {
      return new Response({
        statusCode:201,
        status:responseStatus.OK,
        message:this.i18n.t('lang.users.ReadOK',{ lang:   I18nContext.current().lang }),
        data: await this.usersService.findOne(+userId)
      });
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw new BadRequestException ({'status':'ERROR','message':error.message,'statusCode':error.statusCode});
    }
  }

  // Traer usuarios por ID
  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  async findOne(@Param('id') id: number) {
    try {
      return new Response({
        statusCode:201,
        status:responseStatus.OK,
        message:this.i18n.t('lang.users.ReadOK',{ lang:   I18nContext.current().lang }),
        data: await this.usersService.findOne(+id)
      });
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw new BadRequestException ({'status':'ERROR','message':error.message,'statusCode':error.statusCode});
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
        destination: process.env.USER_PROFILE_PICTURES_DIR,
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
    @UploadedFile() file,
  ) {
    try {
      console.log('file: '+file)
      return new Response({
        statusCode:201,
        status:responseStatus.OK,
        message:this.i18n.t('lang.users.UpdateOK',{args: { id: id }, lang:   I18nContext.current().lang }),
        data: await this.usersService.update(id, updateUserDto, currentUser, file)
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new BadRequestException ({'status':'ERROR','message':error.message,'statusCode':error.statusCode});
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
      return new Response({
        statusCode:201,
        status:responseStatus.OK,
        message:this.i18n.t('lang.users.rolUpdateOK',{args: { id: id }, lang:   I18nContext.current().lang }),
        data: await this.usersService.updateRole(id, updateUserRolesDto)
      });
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      throw new BadRequestException ({'status':'ERROR','message':error.message,'statusCode':error.statusCode});
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
      return new Response({
        statusCode:201,
        status:responseStatus.OK,
        message:this.i18n.t('lang.users.DeleteOK',{args: { id: id }, lang:   I18nContext.current().lang }),
        data: await this.usersService.remove(id)
      });
    } catch (e) {
      console.error('Error al eliminar usuario:', e);
      throw new BadRequestException ({'status':'ERROR','message':e.message,'statusCode':e.statusCode});
    }
  }
}
