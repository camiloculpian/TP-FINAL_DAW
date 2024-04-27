import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PersonsModule } from './persons/persons.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketsModule } from './tickets/tickets.module';
import { TicketAuditsModule } from './audit/ticket-audits.module';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: 'src/config/database.env',
});


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
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
