import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Person } from '../persons/entities/person.entity';
import { Transform } from 'class-transformer';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,

    private dataSource: DataSource
  ){}

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      const person = await this.personRepository.save({...createUserDto});
      const user = await this.userRepository.save({...createUserDto, person});
      await queryRunner.commitTransaction();
      return await this.userRepository.find(
        {
          where:{
            id: user.id
          },
          relations: {
              person: true,
          },
        }
      );
    }catch (e){
      console.log(e);
      await queryRunner.rollbackTransaction();
      return e;
    }finally {
      await queryRunner.release();
    }
  }

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

  async findOne(id: number) {
    try{
      return await this.userRepository.find(
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
