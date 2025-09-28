import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll(city?: string, page = 1, limit = 10) {
        const where = {
            city,
        };

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    created_at: 'desc',
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                last_page: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: { id: true, full_name: true, email: true, phone: true, date_of_birth: true, address: true, city: true, lat: true, photo_url: true },
        });
    }

    async remove(id: string) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
