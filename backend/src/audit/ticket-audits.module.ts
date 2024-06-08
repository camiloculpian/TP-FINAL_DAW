import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketAudit } from "./entities/ticket-audits.entity";
import { TicketAuditsService } from "./ticket-audits.service";
import { TicketAuditsController } from "./ticket-audits.controller";
import { UsersModule } from "../users/users.module";
import { TicketsModule } from "../tickets/tickets.module";
import { DataSource } from "typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([TicketAudit]),
    UsersModule,
    TicketsModule
  ],
  controllers: [TicketAuditsController],
  providers: [TicketAuditsService],
  exports: [TypeOrmModule],
})

export class TicketAuditsModule implements OnModuleInit{
  private trigger:string = "";
  constructor(private dataSource: DataSource){}
  async createAuditTriggers(){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    console.log(this.trigger)
    console.log (await queryRunner.query(this.trigger));
    await queryRunner.release();
  }
  onModuleInit(){ 
    //console.log("NO SE COMO INICIALIZAR AUTOMATICAMENTE LOS TRIGGERS DE AUDITORIA")
    //this.createAuditTriggers();
  }
}