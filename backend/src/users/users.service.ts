import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RelationId, Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    try{
      return await this.userRepository.save(createUserDto);
    }catch (e){
      console.log(e);
      return e;
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
