import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Post()
    create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user.id;
        return this.ordersService.create(userId, createOrderDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get()
    findAll(@Req() req) {
        const userId = req.user.id;
        const userRole = req.user.role;
        return this.ordersService.findAll(userId, userRole);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get('my-orders')
    getMyOrders(@Req() req) {
        const userId = req.user.id;

        return this.ordersService.getUserOrders(userId);
    }

    @Get('stats')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    getOrderStatistics() {
        return this.ordersService.getOrderStatistics();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get(':id')
    findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user.id;
        const userRole = req.user.role;

        return this.ordersService.findOne(id, userId, userRole);
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(id, updateOrderStatusDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Patch(':id/cancel')
    cancelOrder(@Req() req, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user.id;
        const userRole = req.user.role;

        return this.ordersService.cancelOrder(id, userId, userRole);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Post('checkout/cart')
    async checkoutFromCart(@Req() req) {
        const userId = req.user.id;

        // Get user's cart with items
        const cart = await this.ordersService['prisma'].cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            throw new ForbiddenException('Cart is empty');
        }

        const createOrderDto: CreateOrderDto = {
            items: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        return this.ordersService.create(userId, createOrderDto);
    }
}
