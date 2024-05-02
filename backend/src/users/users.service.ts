import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Person } from '../persons/entities/person.entity';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateUserRolesDto } from './dto/update-userRoles.dto ';
import { Role } from 'src/auth/enums/role.enum';
import { responseStatus } from 'src/common/responses/responses';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,

    private dataSource: DataSource
  ) { }

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Chequeo si existe persona con ese gmail
      const existingPersonByEmail = await this.personRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingPersonByEmail) {
        throw new BadRequestException('**ERROR: Person with email already exists');
      }


      // Chequeo si existe persona con ese dni
      if (createUserDto.dni) {
        const existingPersonByDNI = await this.personRepository.findOne({
          where: { dni: createUserDto.dni },
        });

        if (existingPersonByDNI) {
          throw new BadRequestException('**ERROR: Person with DNI already exists');
        }
      }

      // Guarda la persona y el usuario si pasan todas las comprobaciones
      const person = await this.personRepository.save({ ...createUserDto });
      const user = await this.userRepository.save({ ...createUserDto, person });

      await queryRunner.commitTransaction();
      // console.log(user);
      return 'Successfully created user';

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // busca todos
  async findAll() {
    try {
      return await this.userRepository.find({
        relations: {
          person: true,
        },
      })
    } catch (e) {
      console.log(e)
      return e;
    }
  }
  // busca uno by id
  async findOne(id: number) {
    try {
      return await this.userRepository.findOne(
        {
          where: {
            id: id
          },
          relations: {
            person: true,
          },
          select: ["id", "username", 'roles', 'profilePicture']
        }
      );
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  // Cambiar y hacer uso de findOneByEmail y findOneByDNI para retornar el login
  async findOneByUsernameAndPasswd(username: string, password: string) {
    try {
      return await this.userRepository.findOne(
        {
          where: {
            username: username,
            password: password
          },
          relations: {
            person: true,
          },
        }
      );
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async findOneByUsername(username: string) {
    try {
      return await this.userRepository.findOne(
        {
          where: {
            username: username,
          },
          relations: {
            person: true,
          },
        }
      );
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.personRepository.findOne(
        {
          where: {
            email: email
          },
          relations: {
            user: true
          },
        }
      );
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async findOneByDNI(dni: string) {
    try {
      return await this.personRepository.findOne(
        {
          where: {
            dni: dni
          },
          relations: {
            user: true,
          },
        }
      );
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: number, file: Express.Multer.File) {
    const user= await this.userRepository.findOne( {where: {
      id: currentUser
    }});
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Obtener el usuario que se está actualizando
      const userToUpdate = await this.userRepository.findOne(
        {
          where:{id:id},
          relations:{person:true}
        }
      );
      if (!userToUpdate) {
        throw new NotFoundException('Usuario no encontrado');
      }
  
      // Verificar si el usuario actual tiene permiso de administrador
      const isAdmin = user.roles === Role.ADMIN;
  
      // Verificar si el usuario actual está actualizando su propio perfil
      const isCurrentUser = user.id === id;
  
      // Verificar si se cargó un archivo
      if (file) {
        updateUserDto.profilePicture = file.filename;
      }
  
      // Verificar si el usuario actual tiene permiso para actualizar el usuario
      if (!isAdmin && !isCurrentUser) {
        throw new ForbiddenException('No tienes permiso para modificar este usuario');
      }
  
      // Solo permitir la actualización de la contraseña y la imagen de perfil si el usuario está actualizando su propio perfil
      if (!isAdmin && isCurrentUser) {
        if(updateUserDto.username||updateUserDto.password||updateUserDto.profilePicture||updateUserDto.email||updateUserDto.phone) {
          updateUserDto = {
            username: updateUserDto.username,
            password: updateUserDto.password,
            profilePicture: updateUserDto.profilePicture,
            email: updateUserDto.email,
            phone: updateUserDto.phone,
          };
        }else{
          throw new ForbiddenException('No tienes permiso para modificar este campo');
        }
      }
  
      // Actualizar el usuario y su perfil asociado
      await this.userRepository.save({ ...userToUpdate, ...updateUserDto });
      await this.personRepository.save({ ...userToUpdate.person, ...updateUserDto });
  
      await queryRunner.commitTransaction();
  
      return { status: 'OK', message: 'Los datos del usuario se actualizaron correctamente' };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e.message);
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    } finally {
      await queryRunner.release();
    }
  }
  

  async updateRole(id: number, updateUserRolesDto: UpdateUserRolesDto) {
    try {
      await this.userRepository.update(id, updateUserRolesDto);
      return ({ statusCode: 200, status: 'OK', message: 'OK: El rol del usuario se actualizó de forma correcta' });
    } catch (e) {
      console.log(e)
      return ({ statusCode: e.statusCode, status: 'ERROR', message: e.message });
    }
  }

  async remove(id: number) {
    try {
      return await this.userRepository.softDelete(id);
    } catch (e) {
      console.log(e)
      return e;
    }
  }

  async getRolesById(id: number) {
    try {
      return await this.userRepository.findOne(
        {
          where: {
            id: id
          },
          select: {
            roles: true,
          },
        }
      );
    } catch (e) {
      console.log(e)
      return e;
    }
  }
}