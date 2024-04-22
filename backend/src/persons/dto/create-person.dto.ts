import { IsBoolean, IsDate, IsDateString, IsEmail, IsEnum, IsNumber, IsNumberString, IsPhoneNumber, IsString, Length, MaxLength, MinLength, isNumber, isNumberString, length } from "class-validator";
import { Gender } from "../entities/person.entity";

export class CreatePersonDto {
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

    @IsEnum(Gender) /**TRUE: MALE FALSE: FEMALE*/
    gender: Gender;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;
    
    @IsOptional()
    profilePictureFile?: Express.Multer.File;
}
