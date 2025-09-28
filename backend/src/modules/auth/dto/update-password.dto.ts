import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/modules/common/enums/role.enum';

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    role: Role;
}
