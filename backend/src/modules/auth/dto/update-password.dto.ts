import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/modules/common/enums/role.enum';

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
