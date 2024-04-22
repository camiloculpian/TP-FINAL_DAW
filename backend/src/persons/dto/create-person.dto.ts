import { IsBoolean, IsDate, IsDateString, IsEmail,IsOptional,  IsNumber, IsNumberString, IsPhoneNumber, IsString, Length, MaxLength, MinLength, isNumber, isNumberString, length } from "class-validator";

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

    //@IsBoolean() /**TRUE: MALE FALSE: FEMALE*/
    gender: boolean;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;
    
    @IsOptional()
    profilePictureFile?: Express.Multer.File;
}
