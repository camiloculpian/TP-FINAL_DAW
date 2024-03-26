import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';
import { IsBoolean, IsDateString, IsEmail, IsNumberString, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

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
    dni?:number;

    @IsString()
    @IsOptional()
    address?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: Date;

    @IsBoolean() /**TRUE: MALE FALSE: FEMALE*/
    @IsOptional()
    gender?: boolean;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;
}
