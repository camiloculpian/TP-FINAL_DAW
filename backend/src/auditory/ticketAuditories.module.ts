import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketAuditory } from "./entities/ticketAuditory.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketAuditory]),
    TicketAuditory
  ],
})
export class TicketAuditoriesModule {}