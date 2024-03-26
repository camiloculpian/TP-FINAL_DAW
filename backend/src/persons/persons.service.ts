import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class PersonsService {

  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>
  ){}

  async create(createPersonDto: CreatePersonDto) {
    const person = this.personRepository.create(createPersonDto);
    try{
      return await this.personRepository.save(person);
    }catch (e){
      console.log(e);
      return e;
    }
  }

  async findAll() {
    try{
      return await this.personRepository.find();
    }catch(e){
      console.log(e)
      return e;
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  async remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
