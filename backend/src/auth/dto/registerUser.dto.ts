import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsEmail, IsHash, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength, minLength } from "class-validator";

export class RegisterUserDto {
    @Transform(({value}) => value.trim())
    @IsString()
    username: string;

    @Transform(({value}) => value.trim())
    @IsHash('sha512')
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