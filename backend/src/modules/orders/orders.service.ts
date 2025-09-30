import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, UserRole } from 'generated/prisma';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, createOrderDto: CreateOrderDto) {
        const { items } = createOrderDto;

        // Validate items and calculate total
        let total = 0;
        const orderItems: any = [];

        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }

            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // Create order within a transaction
        return this.prisma.$transaction(async (prisma) => {
            // Create the order
            const order = await prisma.order.create({
                data: {
                    userId,
                    total,
                    status: OrderStatus.PENDING,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: { category: true },
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
            });

            // Update product stock
            for (const item of items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            // Clear user's cart
            await prisma.cartItem.deleteMany({
                where: {
                    cart: {
                        userId,
                    },
                },
            });

            return order;
        });
    }

    async findAll(userId: number, userRole: UserRole) {
        const where = userRole === UserRole.ADMIN ? {} : { userId };

        return this.prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: {
                            include: { category: true },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: number, userId: number, userRole: UserRole) {
        const where = userRole === UserRole.ADMIN ? { id } : { id, userId };

        const order = await this.prisma.order.findFirst({
            where,
            include: {
                items: {
                    include: {
                        product: {
                            include: { category: true },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return order;
    }

    async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
        const { status } = updateOrderStatusDto;

        await this.findOne(id, 0, UserRole.ADMIN); // Check if order exists

        return this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        product: {
                            include: { category: true },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
    }

    async cancelOrder(id: number, userId: number, userRole: UserRole) {
        const order: any = await this.findOne(id, userId, userRole);

        // Only allow cancellation for pending or confirmed orders
        if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
            throw new BadRequestException(`Cannot cancel order with status: ${order.status}`);
        }

        // Restore product stock
        await this.prisma.$transaction(async (prisma) => {
            for (const item of order.items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }

            await prisma.order.update({
                where: { id },
                data: { status: OrderStatus.CANCELLED },
            });
        });

        return this.findOne(id, userId, userRole);
    }

    async getUserOrders(userId: number) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: { category: true },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getOrderStatistics() {
        const totalOrders = await this.prisma.order.count();
        const totalRevenue = await this.prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { not: OrderStatus.CANCELLED } },
        });
        const pendingOrders = await this.prisma.order.count({
            where: { status: OrderStatus.PENDING },
        });

        const ordersByStatus = await this.prisma.order.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
        });

        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            pendingOrders,
            ordersByStatus,
            recentOrders,
        };
    }
}
