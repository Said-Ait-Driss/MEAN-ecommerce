import { IsDefined, IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    phoneCode: string;

    @IsOptional()
    @IsString()
    dateOfBirth: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsNotEmpty()
    role: Role;
}
