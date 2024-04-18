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
  ){}

  // ORIGINAL CODE
  // TO-DO: Chequear que el usuario y/o la persona exista y devolver un ERROR
  // async create(createUserDto: CreateUserDto) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try{
  //     const person = await this.personRepository.save({...createUserDto});
  //     const user = await this.userRepository.save({...createUserDto, person});
  //     await queryRunner.commitTransaction();
  //     return await this.userRepository.find(
  //       {
  //         where:{
  //           id: user.id
  //         },
  //         relations: {
  //             person: true,
  //         },
  //       }
  //     );
  //   }catch (e){
  //     console.log(e);
  //     await queryRunner.rollbackTransaction();
  //     return e;
  //   }finally {
  //     await queryRunner.release();
  //   }
  // }


  // FORMA 1: FUNCA OKOK
  // async create(createUserDto: CreateUserDto) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     // Check if person with email already exists
  //     const existingPerson = await this.personRepository.findOne({
  //       where: { email: createUserDto.email },
  //     });
  
  //     if (existingPerson) {
  //       // Throw BadRequestException if person with email already exists
  //       throw new BadRequestException('**ERROR: Person with email already exists');
  //     }
  
  //     // Check if username is available
  //     const existingUser = await this.userRepository.findOne({
  //       where: { username: createUserDto.username },
  //     });
  
  //     if (existingUser) {
  //       // Throw BadRequestException if username already exists (optional)
  //       throw new BadRequestException('**ERROR: Username already exists');
  //     }
  
  //     // Save person and user if checks pass
  //     const person = await this.personRepository.save({ ...createUserDto });
  //     const user = await this.userRepository.save({ ...createUserDto, person });
  
  //     await queryRunner.commitTransaction();
  //     return await this.userRepository.find({
  //       where: { id: user.id },
  //       relations: { person: true },
  //     });
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  
  //     // Log error message to console
  //     console.log(error.message);
  
  //     // Re-throw the error for handling in the controller
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
  
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
  
      // Check for existing user with username
      const existingUserByUsername = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });
  
      if (existingUserByUsername) {
        throw new BadRequestException('**ERROR: Username already exists');
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

      // Check for existing person with LastName & name
      if (createUserDto.lastName) {
        const existingPersonByLastName = await this.personRepository.findOne({
          where: { lastName: createUserDto.lastName }&& {name:createUserDto.name}
        });
  
        if (existingPersonByLastName) {
          throw new BadRequestException('**ERROR: Person with Lastname and Name already exists');
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
    try{
      return await this.userRepository.find({
        relations: {
            person: true,
        },
      })
    }catch(e){
      console.log(e)
      return e;
    }
  }
  // busca uno by id
  async findOne(id: number) {
    try{
      return await this.userRepository.findOne(
        {
          where:{
            id: id
          },
          relations: {
              person: true,
          },
        }
      );
    }catch(e){
      console.log(e)
      return e;
    }
  }

  async findOneByUsername(username: string){
    try{
      return await this.userRepository.findOne(
        {
          where:{
            username: username
          },
          relations: {
              person: true,
          },
        }
      );
    }catch(e){
      console.log(e)
      return e;
    }
  }

  async findOneByEmail(email: string){
    try{
      return await this.personRepository.findOne(
        {
          where:{
            email: email
          },
          relations: {
              user: true
          },
        }
      );
    }catch(e){
      console.log(e)
      return e;
    }
  }

  async findOneByDNI(dni: string){
    try{
      return await this.personRepository.findOne(
        {
          where:{
            dni: dni
          },
          relations: {
              user: true,
          },
        }
      );
    }catch(e){
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
          where:{
            id: id
          },
          relations: {
              person: true
          },
        }
      );
      await this.userRepository.save({...user, ...updateUserDto});
      await this.personRepository.save({...user.person, ...updateUserDto });
      await queryRunner.commitTransaction();
      return 'Successfully updated user';

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateRole(id: number, updateUserRolesDto: UpdateUserRolesDto) {
    try{
      return await this.userRepository.update(id,updateUserRolesDto);
    }catch(e){
      console.log(e)
      return e;
    }
  }

  async remove(id: number) {
    try{
      return await this.userRepository.softDelete(id);
    }catch(e){
      console.log(e)
      return e;
    }
  }
}