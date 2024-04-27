import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketAudit } from "./entities/ticket-audits.entity";
import { TicketAuditsService } from "./ticket-audits.service";
import { TicketAuditsController } from "./ticket-audits.controller";
import { UsersModule } from "src/users/users.module";
import { TicketsService } from "src/tickets/tickets.service";
import { TicketsModule } from "src/tickets/tickets.module";

@Module({
  imports: [TypeOrmModule.forFeature([TicketAudit]),
    UsersModule,
    TicketsModule
  ],
  controllers: [TicketAuditsController],
  providers: [TicketAuditsService],
  exports: [TypeOrmModule],
})
export class TicketAuditsModule { }