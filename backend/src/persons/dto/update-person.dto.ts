import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';
import { IsBoolean, IsDateString,IsEnum, IsEmail, IsNumberString, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Gender } from "src/persons/entities/person.entity";

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
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
    gender: Gender;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    profilePicture?: Express.Multer.File;
}
