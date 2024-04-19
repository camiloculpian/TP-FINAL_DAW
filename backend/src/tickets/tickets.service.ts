import { Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

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
    try{
      const user = await this.userService.getRolesById(userId);
      if(user.roles.includes('admin')){
        return await this.ticketRepository.find();
      }else{
        return await this.ticketRepository.find({
          where:{
            asignedToUser: user
          },
        });
      }
    }catch(e){
      console.log(e)
      return e;
    }
  }

  async findOne(id: number, userId: number) {
    // TO-DO: Si no es admin y el ticket existe mostrar ERROR, NO esta autorizado a ver este ticket
    // TO-DO: el rol dispatcher puede ver todos los tickets?
    try{
      const user = await this.userService.getRolesById(userId);
      if(user.roles.includes('admin')){
        return await this.ticketRepository.find({
          where:{
            id: id
          },
        });
      }else{
        return await this.ticketRepository.find({
          where:{
            id: id,
            asignedToUser: user
          },
        });
      }
    }catch(e){
      console.log(e)
      return e;
    }
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
