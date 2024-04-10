// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { PersonsService } from './persons.service';
// import { CreatePersonDto } from './dto/create-person.dto';
// import { UpdatePersonDto } from './dto/update-person.dto';

// @Controller('persons')
// export class PersonsController {
//   constructor(private readonly personsService: PersonsService) {}

//   @Post()
//   create(@Body() createPersonDto: CreatePersonDto) {
//     return this.personsService.create(createPersonDto);
//   }

//   @Get()
//   findAll() {
//     return this.personsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     return this.personsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: number, @Body() updatePersonDto: UpdatePersonDto) {
//     return this.personsService.update(+id, updatePersonDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: number) {
//     return this.personsService.remove(+id);
//   }
// }


// code modified v1.1

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('persons')
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva persona' })
  @ApiResponse({ status: 201, description: 'La persona ha sido creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreatePersonDto })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personsService.create(createPersonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las personas' })
  @ApiResponse({ status: 200, description: 'Lista de todas las personas.' })
  findAll() {
    return this.personsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una persona por ID' })
  @ApiResponse({ status: 200, description: 'Persona encontrada.' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la persona' })
  findOne(@Param('id') id: number) {
    return this.personsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una persona' })
  @ApiResponse({ status: 200, description: 'Persona actualizada con éxito.' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la persona a actualizar' })
  @ApiBody({ type: UpdatePersonDto })
  update(@Param('id') id: number, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personsService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una persona' })
  @ApiResponse({ status: 200, description: 'Persona eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la persona a eliminar' })
  remove(@Param('id') id: number) {
    return this.personsService.remove(+id);
  }
}

