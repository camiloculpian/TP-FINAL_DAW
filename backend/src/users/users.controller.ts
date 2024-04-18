import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UpdateUserRolesDto } from './dto/update-userRoles.dto ';
import { AuthGuard } from '../auth/auth.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Role } from '../auth/enums/role.enum';
// import { AuthGuard } from '../auth/auth.guard';


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
  // @UseGuards(AuthGuard)
  // @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
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
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  //TO-DO: Update user Role passing id and Role (ONLY ADMIN!!!)
  @Patch('/role/:id')
  @ApiBody({ type: UpdateUserRolesDto })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  updateRole(@Param('id') id: number, @Body() updateUserRolesDto: UpdateUserRolesDto ) {
    //return this.usersService.updateRole(+id, updateUserRoleDto);
    return this.usersService.updateRole(id,updateUserRolesDto);
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