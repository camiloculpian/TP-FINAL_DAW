import { IsDate, IsString } from "class-validator";

export class CreatePersonDto {
    @IsString()
    lastName: string;
    @IsString()
    name: string;
    @IsDate()
    birthdate: Date;
}
