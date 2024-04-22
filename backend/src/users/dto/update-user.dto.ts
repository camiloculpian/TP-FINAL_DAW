import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean,IsUrl, IsDateString, IsEmail, IsHash, IsNumberString, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

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

    @IsBoolean() /**TRUE: MALE FALSE: FEMALE*/
    @IsOptional()
    gender?: boolean;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @IsUrl()
    @IsString()
    profilePicture?: string;
}

