import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TicketAudit } from "./entities/ticket-audits.entity";
import { TicketAuditDto } from "src/audit/dto/ticket-audit-dto";

@Injectable()
export class TicketAuditsService {
    constructor(
        @InjectRepository(TicketAudit)
        private readonly ticketAuditsRepository: Repository<TicketAudit>
    ) { }
    
    async findAll(id): Promise<TicketAudit[]> {
        
        try {
            
            return await this.ticketAuditsRepository.find({
                where: {
                    ticket: id
                },
                relations: ['asignedToUser', 'modifiedByUser', 'ticket']
            });
        } catch (error) {
            throw new Error('Error al buscar registros de auditoría');
        }
    }

    async create(ticketAuditDto: TicketAuditDto): Promise<TicketAudit> {
        try {
            const ticketAudit = this.ticketAuditsRepository.create(ticketAuditDto);
            return await this.ticketAuditsRepository.save(ticketAudit);
        } catch (error) {
            throw new Error('Error al crear registro de auditoría');
        }
    }
    async update(id, ticketAuditDto: TicketAuditDto): Promise<TicketAudit> {
        try {
            const existingAudit = await this.ticketAuditsRepository.findOne(id);
            if (!existingAudit) {
                throw new NotFoundException('Registro de auditoría no encontrado');
            }
            this.ticketAuditsRepository.merge(existingAudit, ticketAuditDto);
            return await this.ticketAuditsRepository.save(existingAudit);
        } catch (error) {
            throw new Error('Error al actualizar registro de auditoría');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.ticketAuditsRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Registro de auditoría no encontrado');
            }
        } catch (error) {
            throw new Error('Error al eliminar registro de auditoría');
        }
    }
}