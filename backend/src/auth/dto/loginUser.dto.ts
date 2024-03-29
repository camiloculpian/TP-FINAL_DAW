import { Transform } from "class-transformer";
import { IsHash, IsNumberString, IsString } from "class-validator";

export class LoginUserDto {
    @IsString()
    username: string;

    @IsNumberString()
    dni: string;

    @IsString()
    email: string;

    @IsString()
    password: string;
}