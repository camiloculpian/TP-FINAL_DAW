import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsEmail, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength, minLength } from "class-validator";

export class RegisterUserDto {
    @IsString()
    username: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsNumberString()
    @MinLength(7)
    @MaxLength(8)
    dni:number;

    @IsString()
    address: string;

    @IsDateString()
    birthDate: Date;

    @IsBoolean() /**TRUE: MALE FALSE: FEMALE*/
    gender: boolean;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;
}