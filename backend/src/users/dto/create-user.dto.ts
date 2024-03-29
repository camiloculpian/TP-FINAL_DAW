import { IsBoolean, IsDateString, IsDefined, IsEmail, IsHash, IsNumber, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    username: string;

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
