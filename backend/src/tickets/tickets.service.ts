import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/enums/role.enum'; // Importacion del Roles
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, responseStatus } from 'src/common/responses/responses';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @Inject(UsersService)
    private readonly userService: UsersService,
    private readonly i18n: I18nService
  ) { }

  // Creacion de Tickets: solo admin
  async create(createTicketDto: CreateTicketDto, userId: number) {
    try {
      // Primero los chequeos, y si todo esta OK creao el ticket
      // El usuario que crea el ticket
      const user = await this.userService.findOne(userId);
      // El usuario que al que pertenece el ticket
      const userAsignedTo = await this.userService.findOne(
        createTicketDto.asignedToUserId,
      );
      if (!userAsignedTo) {
        throw new BadRequestException({status:responseStatus.ERROR,message:this.i18n.t('lang.tickets.ReasignToUserError',{lang: I18nContext.current().lang})});
      }
      // Si todo es OK!
      let ticket = this.ticketRepository.create({
        ...createTicketDto,
      });
      ticket.asignedToUser = userAsignedTo;
      ticket.asignedByUser = user;
      ticket.createdByUser = user;
      ticket.lastModifiedByUser = user;
      ticket = await this.ticketRepository.save(ticket);
      // return new Response({
      //   statusCode:201,
      //   status:responseStatus.OK,
      //   message: this.i18n.t('lang.tickets.CreateOK',{args: { id: ticket.id },lang: I18nContext.current().lang}),
      //   data: ticket,
      // });
      return ticket;
    } catch (e) {
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  //Parametros de busqueda
  async findAll(userId: number, filter?: string, service?: string, status?: TicketStatus, asignedToUserId?: number, page?: number, limit?: number) {
    try {
      const user = await this.userService.findOne(userId);
      let queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.asignedToUser', 'asignedToUser');

      if (filter) {
        filter = '%'+filter+'%';
        queryBuilder = queryBuilder.andWhere('ticket.id LIKE :filter || ticket.title LIKE :filter || ticket.description LIKE :filter || asignedToUser.username LIKE :filter', { filter });
      }

      if (service) {
        queryBuilder = queryBuilder.andWhere('ticket.service = :service', { service });
      }

      if (status) {
        queryBuilder = queryBuilder.andWhere('ticket.status = :status', { status });
      }

      if (asignedToUserId) {
        queryBuilder = queryBuilder.andWhere('ticket.asignedToUser.id = :asignedToUserId', { asignedToUserId });
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

      return await queryBuilder.getMany();
      //RETORNAR RESPUESTA

      //return tickets;
    } catch (e) {
      throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
    }
  }

  // Mostar tickets
  async findOne(id: number, userId: number) {
    try {
      const user = await this.userService.findOne(userId);

      // Buscar el ticket por su ID
      const ticket = await this.ticketRepository.findOne({
        where: { id },
        relations: ['asignedToUser'], // Opcional: cargar relación de usuario asignado
      });

      if (!ticket) {
        throw new BadRequestException({status:responseStatus.ERROR,message:this.i18n.t('lang.tickets.TicketNotFound',{lang: I18nContext.current().lang})});
      }

      if (!user.roles.includes(Role.ADMIN) && (ticket.asignedToUser.id !== userId || ticket.status == TicketStatus.RESOLVED)) {
        //console.log(!user.roles.includes(Role.ADMIN)+'AND ('+(ticket.asignedToUser.id !== userId)+' || '+(ticket.status == TicketStatus.RESOLVED)+' = '+(!user.roles.includes(Role.ADMIN) && (ticket.asignedToUser.id !== userId || ticket.status == TicketStatus.RESOLVED)));
        // Si el usuario no es administrador, ni el usuario asignado al ticket, y el ticket esta resuelto,
        // no está autorizado a ver este ticket
        throw new UnauthorizedException({status:responseStatus.ERROR,message:'No está autorizado a ver este ticket'});
      }
      return ticket;
    } catch (e) {
      if(e instanceof BadRequestException || e instanceof UnauthorizedException){
        throw e;
      }else{
        throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
      }
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
        throw new BadRequestException({status:responseStatus.ERROR,message:this.i18n.t('lang.tickets.TicketNotFound',{lang: I18nContext.current().lang})});
      }

      if (user.roles.includes(Role.ADMIN)) {
        // Chequeo si existe el usuario al que le quiero re-asignar el ticket asignedToUserId
        // El usuario que al que pertenece el ticket
        const userAsignedTo = await this.userService.findOne(
          updateTicketDto.asignedToUserId,
        );
        if (!userAsignedTo) {
          throw new BadRequestException({status:responseStatus.ERROR,message:this.i18n.t('lang.tickets.ReasignToUserError',{lang: I18nContext.current().lang})});
        }
        // Si el usuario es un administrador, permitir la actualización de todos los datos
        ticket.title = updateTicketDto.title;
        ticket.description = updateTicketDto.description;
        ticket.status = updateTicketDto.status;
        ticket.priority = updateTicketDto.priority;
        ticket.service = updateTicketDto.service;
        ticket.lastModified = new Date(Date.now());
        ticket.asignedToUser = userAsignedTo;
        ticket.asignedByUser = user;
        ticket.lastModifiedByUser = user;
        let resp = await this.ticketRepository.update(id, ticket);
        if(resp.affected=1){
          return new Response({
            statusCode:201,
            status:responseStatus.OK,
            message: this.i18n.t('lang.tickets.UpdateOK',{args: { id: id }, lang: I18nContext.current().lang})
            //message: `Ticket #${id} actualizado correctamente`
          });
        }else{
          throw new BadRequestException({status:responseStatus.ERROR,message:this.i18n.t('lang.tickets.UpdateError',{args: { id: ticket.id }, lang: I18nContext.current().lang})});
        }
      } else {
        // Si el usuario no es un administrador, actualización solo de la descripción, el estado y el archivo, salvo que el estado sea RESOLVED
        if (ticket.status == TicketStatus.RESOLVED) {
          throw new BadRequestException({status:responseStatus.ERROR,message:'Ticket ya resuelto'});
        }
        if(updateTicketDto.asignedToUserId  || updateTicketDto.priority  || updateTicketDto.service  || updateTicketDto.title){
          throw new UnauthorizedException({status:responseStatus.ERROR,message:'Usted no esta autorizado a cambiar: Usuario asignado, prioridad, servicio y/o titulo'});
        }
        const { description, status, archive } = updateTicketDto;
        const lastModified = new Date(Date.now());
        const lastModifiedByUser = user;

        let resp = await this.ticketRepository.update(id, {
          description,
          status,
          archive,
          lastModified,
          lastModifiedByUser
        });
        if(resp.affected=1){
            return resp;
        }else{
          throw new BadRequestException({status:responseStatus.ERROR,message:this.i18n.t('lang.tickets.UpdateError',{args: { id: ticket.id }, lang: I18nContext.current().lang})});
        }
      }
    } catch (e) {
      if(e instanceof BadRequestException || e instanceof UnauthorizedException){
        console.log(e);
        throw e;
      }else{
        throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
      }
    }
  }

  async remove(id: number) {
    try {
      const result = await this.ticketRepository.softDelete(id);
      if (result.affected && result.affected > 0) {
        return new Response({statusCode:201,status:responseStatus.OK, message: `El ticket ID: ${id} ha sido eliminado con éxito`});
      } else {
        throw new BadRequestException({status:responseStatus.ERROR, message:this.i18n.t('lang.tickets.TicketNotFound',{lang: I18nContext.current().lang})});
      }
    } catch (e) {
      if(e instanceof BadRequestException || e instanceof UnauthorizedException){
        throw e;
      }else{
        throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
      }
    }
  }
}
