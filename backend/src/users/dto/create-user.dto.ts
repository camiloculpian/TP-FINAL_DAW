import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsDefined, IsOptional, IsEmail, IsHash, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength, IsUrl, isString, isEnum, IsEnum } from "class-validator";
import { Role } from "../../auth/enums/role.enum";
import { Gender } from "../../persons/entities/person.entity";
export class CreateUserDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    username: string;

    @IsHash('sha512')
    password: string;

    @IsOptional()
    @IsEnum(Role)
    roles?: Role;

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsNumberString()
    @MinLength(7)
    @MaxLength(8)
    dni: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsDateString()
    birthDate: Date;

    @IsEnum(Gender)
    gender: Gender;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsPhoneNumber()
    phone: string;

    @IsOptional()
    @IsString()
    profilePicture?: string;
}
