import { IsBoolean, IsDate, IsEmail, IsNumber, IsPhoneNumber, IsString, Length, MaxLength, MinLength, isNumber, isNumberString, length } from "class-validator";

export class CreatePersonDto {
    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsNumber()
    @MinLength(7)
    @MaxLength(8)
    dni:number;

    @IsString()
    address: string;

    @IsDate()
    birthdate: Date;

    @IsBoolean() /**TRUE: MALE FALSE: FEMALE*/
    gender: boolean;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;

}
