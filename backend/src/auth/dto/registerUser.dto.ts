import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsEmail, IsHash, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength, minLength } from "class-validator";

export class RegisterUserDto {
    @Transform(({value}) => value.trim())
    @IsString()
    username: string;

    @IsHash('sha512')
    password: string;

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsNumberString()
    @MinLength(7)
    @MaxLength(8)
    dni:string;

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