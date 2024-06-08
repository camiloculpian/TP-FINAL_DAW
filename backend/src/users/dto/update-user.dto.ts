import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsUrl, IsEnum, IsDateString, IsEmail, IsHash, IsNumberString, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Gender } from "../..//persons/entities/person.entity";
import { Role } from '../../auth/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    username?: string;

    @IsHash('sha512')
    @IsOptional()
    password?: string;

    // Chequear que para esto sea admin
    @IsEnum(Role)
    @IsOptional()
    roles?:Role

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsNumberString()
    @MinLength(7)
    @MaxLength(8)
    @IsOptional()
    dni?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: Date;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @IsOptional()
    @IsString()
    profilePicture?: string;
}



