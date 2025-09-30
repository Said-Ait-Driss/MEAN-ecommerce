import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async create(createCategoryDto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: createCategoryDto,
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            include: { products: true },
        });
    }

    async findOne(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        await this.findOne(id); // Check if category exists

        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id); // Check if category exists

        // Check if category has products
        const categoryWithProducts = await this.prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });

        if (categoryWithProducts && categoryWithProducts.products.length > 0) {
            throw new NotFoundException('Cannot delete category with associated products');
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
