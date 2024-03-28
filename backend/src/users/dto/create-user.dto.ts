import { IsAlpha, IsDefined, IsInstance, IsJSON, IsNumber, IsNumberString, IsString, isJSON } from "class-validator";
import { Person } from "src/persons/entities/person.entity";

export class CreateUserDto {
    @IsString()
    username: string;
    @IsString()
    password: string;
    @IsDefined()
    person: Person;
}
