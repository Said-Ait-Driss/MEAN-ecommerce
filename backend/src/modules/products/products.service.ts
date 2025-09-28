import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: createProductDto,
            include: { category: true },
        });
    }

    async findAll(page: number = 1, limit: number = 10, categoryId?: number) {
        const skip = (page - 1) * limit;
        const where = categoryId ? { categoryId } : {};

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: { category: true },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: { category: true },
        });
    }

    async remove(id: number) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
