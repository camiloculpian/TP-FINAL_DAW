import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsDefined, IsEmail, IsHash, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength, IsUrl, isString } from "class-validator";

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
    @IsString()
    gender: boolean;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;

    // @IsUrl()
    // @IsString()
    profilePicture?: string;
}
