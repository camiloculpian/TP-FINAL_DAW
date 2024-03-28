import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PersonsModule } from './persons/persons.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditsModule } from './audits/audits.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuditsModule } from './audits/audits.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PersonsModule,
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
    AuditsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
