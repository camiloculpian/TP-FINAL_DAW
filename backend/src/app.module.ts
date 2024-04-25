import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PersonsModule } from './persons/persons.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketsModule } from './tickets/tickets.module';
import { TicketAuditsModule } from './audit/ticket-audits.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "daw",
      password: "daw-1234",
      database: "daw-demo",
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PersonsModule,
    TicketsModule,
    TicketAuditsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
