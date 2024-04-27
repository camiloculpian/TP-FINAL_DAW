import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TicketAudit } from "./entities/ticket-audits.entity";
import { TicketsService } from "src/tickets/tickets.service";

@Injectable()
export class TicketAuditsService {
    constructor(
        @InjectRepository(TicketAudit)
        private readonly ticketAuditsRepository: Repository<TicketAudit>,
        @Inject(TicketsService)
        private readonly ticketsService
    ) { }

    async findAll(id) {
        let ticket = await this.ticketsService.findOne(id);
        try {
            return await this.ticketAuditsRepository.find({
                relations: {
                    asignedToUser: true,
                    modifiedByUser: true,
                    ticket: true
                }, where: {
                    ticket: ticket
                }
            });
        } catch (e) {
            return e;
        }
    }
}