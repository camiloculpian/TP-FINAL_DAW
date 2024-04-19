import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository <Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository <User>
  ){}

  async create(createTicketDto: CreateTicketDto) {
    try{
      return await this.ticketRepository.save(createTicketDto);
    }catch (e){
      console.log(e);
      return e;
    }
  }

  async findAll(userId: number) {
    console.log(userId);
    const user = await this.userRepository.findOne({
      where:{
        id: userId
      }
    })
    console.log(user);
    try{
      return await this.ticketRepository.find();
    }catch(e){
      console.log(e)
      return e;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  async remove(id: number) {
    try{
      return await this.ticketRepository.softDelete(id);
    }catch(e){
      console.log(e)
      return e;
    }
  }
}
