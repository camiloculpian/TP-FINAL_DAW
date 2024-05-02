import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { responseStatus } from 'src/common/responses/responses';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) { }

  async create(createPersonDto: CreatePersonDto) {
    try {
      return await this.personRepository.save(createPersonDto);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async findAll() {
    try {
      return await this.personRepository.find({
        // relations: {
        //     user: true,
        // },
      });
    } catch (e) {
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async findOne(id: number) {
    try {
      return await this.personRepository.find({
        where: {
          id: id,
        },
        // relations: {
        //     user: true,
        // },
      });
    } catch (e) {
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    try {
      return await this.personRepository.update(id, updatePersonDto);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async remove(id: number) {
    try {
      return await this.personRepository.softDelete({ id });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }
}
