import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketAudit } from "./entities/ticket-audits.entity";

@Module({
    imports: [TypeOrmModule.forFeature([TicketAudit]),],
    // controllers: [TicketAuditsController],
    // providers: [TicketAuditsService],
    exports: [TypeOrmModule],
  })
  export class TicketAuditsModule {}