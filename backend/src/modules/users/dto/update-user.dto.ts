import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    full_name?: string;

    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsString()
    @IsNotEmpty()
    phone?: string;

    @IsString()
    @IsNotEmpty()
    phone_code?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    date_of_birth?: string;

    @IsString()
    @IsOptional()
    photo_url?: string;
}
