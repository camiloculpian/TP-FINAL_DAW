import { Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/auth/enums/role.enum'; // Assuming Role enum is imported
import { InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';



@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @Inject(UsersService)
    private readonly userService: UsersService
  ) { }

  async create(createTicketDto: CreateTicketDto, userId: number) {
    
    try {
      // El usuario que crea el ticket
      const user = await this.userService.findOne(userId);
      const ticket = this.ticketRepository.create({
        ... createTicketDto
      });
      // Chequeo si existe el usuario al que le quiero asignar el ticket asignedToUserId
      // El usuario que al que pertenece el ticket
      const userAsignedTo = await this.userService.findOne(createTicketDto.asignedToUserId);

      if (!userAsignedTo) {
          throw new NotFoundException('User who you wants to asign the ticket not exist!');
      }
      console.log(userAsignedTo);
      ticket.asignedToUser = userAsignedTo;
      ticket.asignedByUser = user;
      ticket.createdByUser = user;
      ticket.lastModifiedByUser = user;
      return await this.ticketRepository.save(ticket);
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async findAll(userId: number) {
    try {
      const user = await this.userService.getRolesById(userId);
      if (user.roles.includes(Role.ADMIN)) {
        return await this.ticketRepository.find();
      } else {
        return await this.ticketRepository.find({
          where: {
            asignedToUser: user
          },
        });
      }
    } catch (e) {
      console.log(e)
      return e;
    }
  }

  // original code
  // async findOne(id: number, userId: number) {
  //   // TO-DO: Si no es admin y el ticket existe mostrar ERROR, NO esta autorizado a ver este ticket
  //   // TO-DO: el rol dispatcher puede ver todos los tickets?
  //   try{
  //     const user = await this.userService.getRolesById(userId);
  //     if(user.roles.includes('admin')){
  //       return await this.ticketRepository.find({
  //         where:{
  //           id: id
  //         },
  //       });
  //     }else{
  //       return await this.ticketRepository.find({
  //         where:{
  //           id: id,
  //           asignedToUser: user
  //         },
  //       });
  //     }
  //   }catch(e){
  //     console.log(e)
  //     return e;
  //   }
  // }

  
  async findOne(id: number, userId: number) {
    try {
      const user = await this.userService.getRolesById(userId);
      
      // Verificar si el usuario tiene rol de administrador
      const isAdmin = user.roles.includes(Role.ADMIN);
      
      // Verificar si el usuario es un despachador
      //const isDispatcher = user.roles.includes(Role.DISPATCHER);
  
      // Buscar el ticket por su ID
      const ticket = await this.ticketRepository.findOne({
        where: { id },
        relations: ['asignedToUser'], // Opcional: cargar relación de usuario asignado
      });
  
      if (!ticket) {
        throw new NotFoundException('Ticket no encontrado');
      }
  
      if (!isAdmin && ticket.asignedToUser.id !== userId /* && !isDispatcher */) {
        // Si el usuario no es administrador, ni el usuario asignado al ticket, ni un despachador,
        // no está autorizado a ver este ticket
        throw new UnauthorizedException('No está autorizado a ver este ticket');
      }
  
      return ticket;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al buscar el ticket');
    }
  }
  
  // update(id: number, updateTicketDto: UpdateTicketDto) {
  //   return `This action updates a #${id} ticket`;
  //   // CONDICIONES:
  //   // Si el que modifica tiene rol "admin" puede modificar TODO de TODOS los tickets
  //   // Si el que modifica tiene rol "usuario" solo puede:
  //   // - Modificar descripcion SUS tickets
  //   // - Modificar estado SUS tickets
  //   // si modifico asignedToUser tengo que guardar el valor de quien asigno el ticket en asignedByUser
  // }

  // Modificaciones hechas de update ↑
  async update(id: number, updateTicketDto: UpdateTicketDto, userId: number) {
    try {
      const user = await this.userService.getRolesById(userId);
      const isAdmin = user.roles.includes(Role.ADMIN);

      const ticket = await this.ticketRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!ticket) {
        throw new NotFoundException('Ticket no encontrado');
      }

      ticket.lastModifiedByUser = user.userId;

      if (isAdmin || Number(ticket.asignedToUser) === userId) {
        // Si el usuario es un administrador o es el asignado al ticket,
        // permitir la actualización de todos los campos del ticket
        await this.ticketRepository.update(id, updateTicketDto);
        return { message: `Ticket #${id} actualizado` };
      } else {
        // Si el usuario no es un administrador y no es el asignado al ticket,
        // permitir la actualización solo de la descripción y el estado
        const { description, status } = updateTicketDto;
        await this.ticketRepository.update(id, { description, status });
        return { message: `Ticket #${id} actualizado (solo descripción y estado)` };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar el ticket');
    }
  }

  async remove(id: number) {
    try {
      return await this.ticketRepository.softDelete(id);
    } catch (e) {
      console.log(e)
      return e;
    }
  }
}
