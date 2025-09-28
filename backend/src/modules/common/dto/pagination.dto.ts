import { IsOptional, IsPositive, IsNumber, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    limit?: number = 10;

    // Optional: Add sorting parameters
    @IsOptional()
    @IsString()
    sortBy?: string = 'created_at';

    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';
}
