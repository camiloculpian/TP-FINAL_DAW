import { Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository <Ticket>,
    @Inject(UsersService)
    private readonly userService: UsersService
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
    // TO-DO: Si es admin mostrar tickets de todos los usuarios, sino mostrar solo los propios!!!
    console.log(userId);
    const user = await this.userService.getRolesById(userId);
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
