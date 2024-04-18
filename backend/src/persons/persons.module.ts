import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { Person } from './entities/person.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    UsersModule
  ],
  controllers: [PersonsController],
  providers: [PersonsService],
  exports: [PersonsService,TypeOrmModule]
})
export class PersonsModule {}
