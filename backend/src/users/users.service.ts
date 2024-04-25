import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Person } from '../persons/entities/person.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserRolesDto } from './dto/update-userRoles.dto ';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,

    private dataSource: DataSource
  ) { }

  // FORMA 2: FUNCA OKOK
  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Check for existing person with email
      const existingPersonByEmail = await this.personRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingPersonByEmail) {
        throw new BadRequestException('**ERROR: Person with email already exists');
      }

  
      // Check for existing person with DNI
      if (createUserDto.dni) {
        const existingPersonByDNI = await this.personRepository.findOne({
          where: { dni: createUserDto.dni },
        });

        if (existingPersonByDNI) {
          throw new BadRequestException('**ERROR: Person with DNI already exists');
        }
      }

      // Save person and user if all checks pass
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
        }
      );
    } catch (e) {
      console.log(e)
      return e;
    }
  }

  async findOneByUsername(username: string) {
    try {
      return await this.userRepository.findOne(
        {
          where: {
            username: username
          },
          relations: {
            person: true,
          },
        }
      );
    } catch (e) {
      console.log(e)
      return e;
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
      return e;
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
      return e;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOne(
        {
          where: {
            id: id
          },
          relations: {
            person: true
          },
        }
      );
      await this.userRepository.save({ ...user, ...updateUserDto });
      await this.personRepository.save({ ...user.person, ...updateUserDto });
      await queryRunner.commitTransaction();
      return ({ status: 'OK', message: 'OK: Los datos del usuario se actualizaron de forma correcta' });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error.message);
      throw error;
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