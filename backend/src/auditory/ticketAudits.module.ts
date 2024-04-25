import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketAudit } from "./entities/ticketAudits.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketAudit]),
    TicketAudit
  ],
})
export class TicketAuditsModule {}