import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean,IsUrl, IsEnum, IsDateString, IsEmail, IsHash, IsNumberString, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Gender } from "src/persons/entities/person.entity";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    username?: string;

    @IsHash('sha512')
    @IsOptional()
    password?: string;

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
    dni?:string;

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



