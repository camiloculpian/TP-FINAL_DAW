import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsDefined, IsOptional, IsEmail, IsHash, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength, IsUrl, isString, isEnum, IsEnum } from "class-validator";
import { Gender } from "src/persons/entities/person.entity";
export class CreateUserDto {
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

    //@IsBoolean() /**TRUE: MALE FALSE: FEMALE*/ç
    @IsEnum(Gender)
    gender: Gender;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;

    // @IsUrl()
    // @IsString()
    profilePicture?: Express.Multer.File;
}
