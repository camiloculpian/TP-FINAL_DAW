import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/auth/enums/role.enum'; // Importacion del Roles
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, responseStatus } from 'src/common/responses/responses';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) { }

  // Creacion de Tickets: solo admin
  async create(createTicketDto: CreateTicketDto, userId: number) {
    try {
      // El usuario que crea el ticket
      const user = await this.userService.findOne(userId);
      const ticket = this.ticketRepository.create({
        ...createTicketDto,
      });
      // Chequeo si existe el usuario al que le quiero asignar el ticket asignedToUserId
      // El usuario que al que pertenece el ticket
      const userAsignedTo = await this.userService.findOne(
        createTicketDto.asignedToUserId,
      );

      if (!userAsignedTo) {
        throw new BadRequestException({status:responseStatus.ERROR,message:'User who you wants to asign the ticket not exist!'});
      }
      ticket.asignedToUser = userAsignedTo;
      ticket.asignedByUser = user;
      ticket.createdByUser = user;
      ticket.lastModifiedByUser = user;
      return await this.ticketRepository.save(ticket);
    } catch (e) {
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  //Parametros de busqueda
  async findAll(userId: number, service?: string, status?: TicketStatus, assignedToUserId?: number, page?: number, limit?: number) {
    try {
      const user = await this.userService.findOne(userId);
      let queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.asignedToUser', 'asignedToUser');

      if (service) {
        queryBuilder = queryBuilder.andWhere('ticket.service = :service', { service });
      }

      if (status) {
        queryBuilder = queryBuilder.andWhere('ticket.status = :status', { status });
      }

      if (assignedToUserId) {
        queryBuilder = queryBuilder.andWhere('ticket.asignedToUser.id = :assignedToUserId', { assignedToUserId });
      }

      // Si el usuario tiene rol de administrador, puede ver todos los tickets
      // De lo contrario, solo puede ver los tickets asignados a él
      if (!user.roles.includes(Role.ADMIN)) {
        queryBuilder = queryBuilder.andWhere('ticket.asignedToUser.id = :userId', { userId });
        queryBuilder = queryBuilder.andWhere('ticket.status != "RESOLVED"');
      }

      // Configuración de la cantidad de registros visibles
      if (page && limit) {
        const offset = (page - 1) * limit;
        queryBuilder = queryBuilder.skip(offset).take(limit);
      }

      const tickets = await queryBuilder.getMany();
      return tickets;
    } catch (e) {
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  // Mostar tickets
  async findOne(id: number, userId: number) {
    try {
      const user = await this.userService.findOne(userId);

      // Verificar si el usuario tiene rol de administrador
      const isAdmin = user.roles.includes(Role.ADMIN);

      // Buscar el ticket por su ID
      const ticket = await this.ticketRepository.findOne({
        where: { id },
        relations: ['asignedToUser'], // Opcional: cargar relación de usuario asignado
      });

      if (!ticket) {
        throw new BadRequestException({status:responseStatus.ERROR,message:'Ticket no encontrado'});
      }

      if (
        !isAdmin &&
        ticket.asignedToUser.id !== userId || ticket.status == TicketStatus.RESOLVED
      ) {
        // Si el usuario no es administrador, ni el usuario asignado al ticket, y el ticket esta resuelto,
        // no está autorizado a ver este ticket
        throw new UnauthorizedException({status:responseStatus.ERROR,message:'No está autorizado a ver este ticket'});
      }

      return ticket;
    } catch (e) {
      return e;
    }
  }


  // Actualizar ticket: Admin (todos los campos) User (solo archive, description and status)
  async update(id: number, updateTicketDto: UpdateTicketDto, userId: number) {
    try {
      // El usuario que solicita la operacion de actualizacion
      const user = await this.userService.findOne(userId);

      const ticket = await this.ticketRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!ticket) {
        throw new BadRequestException({status:responseStatus.ERROR,message:'Ticket no encontrado'});
      }

      if (user.roles.includes(Role.ADMIN)) {
        // Chequeo si existe el usuario al que le quiero re-asignar el ticket asignedToUserId
        // El usuario que al que pertenece el ticket
        const userAsignedTo = await this.userService.findOne(
          updateTicketDto.asignedToUserId,
        );
        if (!userAsignedTo) {
          throw new BadRequestException({status:responseStatus.ERROR,message:'El usuario al que se le quiere asignar el ticket no existe'});
        }
        // Si el usuario es un administrador, permitir la actualización de todos los datos
        ticket.title = updateTicketDto.title; // Este no estaba 
        ticket.description = updateTicketDto.description;
        ticket.status = updateTicketDto.status;
        ticket.priority = updateTicketDto.priority;
        ticket.service = updateTicketDto.service;
        ticket.lastModified = new Date(Date.now());
        ticket.asignedToUser = userAsignedTo;
        ticket.asignedByUser = user;
        ticket.lastModifiedByUser = user;
        await this.ticketRepository.update(id, ticket);
        return { message: `Ticket #${id} actualizado` };
      } else {
        // Si el usuario no es un administrador, actualización solo de la descripción, el estado y el archivo, salvo que el estado sea RESOLVED
        if (ticket.status == TicketStatus.RESOLVED) {
          throw new BadRequestException({status:responseStatus.ERROR,message:'Ticket ya resuelto'});
        }

        const { description, status, archive } = updateTicketDto;
        const lastModified = new Date(Date.now());

        return new Response({
          status:responseStatus.OK,
          message: `Ticket #${id} actualizado (descripción, estado y archivo)`,
          data:await this.ticketRepository.update(id, {
            description,
            status,
            archive,
            lastModified,
          })
        });
      }
    } catch (e) {
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  async remove(id: number) {
    try {
      const result = await this.ticketRepository.softDelete(id);

      if (result.affected && result.affected > 0) {
        return new Response({status:responseStatus.OK, message: `El ticket ID: ${id} ha sido eliminado con éxito`});
      } else {
        throw new BadRequestException({status:responseStatus.ERROR, message:`No se encontró un ticket con el ID: ${id}`});
      }
    } catch (e) {
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }
}
