import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TicketAudit } from "./entities/ticket-audits.entity";

@Injectable()
export class TicketAuditsService {
    constructor(
        @InjectRepository(TicketAudit)
        private readonly ticketAuditsRepository: Repository<TicketAudit>,
      ) { }

    async findAll(){
        try{
            return await this.ticketAuditsRepository.find({
                relations:{
                    asignedToUser:true,
                    modifiedByUser:true,
                    ticket:true
                }
            });
        }catch(e){
            return e;
        }
    }
}