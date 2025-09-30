import { IsOptional, IsString } from 'class-validator';

export class FindUsersDto {
    @IsOptional()
    @IsString()
    page?: number;

    @IsOptional()
    @IsString()
    limit?: number;

    constructor(partial: Partial<FindUsersDto>) {
        Object.assign(this, partial);
    }
}
