import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class UpdateUserRolesDto extends PartialType(CreateUserDto) {
    @IsEnum(Role)
    roles: Role
}

