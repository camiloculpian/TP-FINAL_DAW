import { IsBoolean, IsDateString, IsDefined, IsEmail, IsNumber, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Person } from "src/persons/entities/person.entity";

export class CreateUserDto {
    @IsString()
    username: string;
    @IsString()
    password: string;
    // @IsNumber()
    // personId: number;

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
