import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get()
    getCart(@Req() req) {
        const userId = req.user.id;
        return this.cartService.getOrCreateCart(userId);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Post('add')
    addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
        const userId = req.user.id;
        return this.cartService.addToCart(userId, addToCartDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Patch('items/:itemId')
    updateCartItem(@Req() req, @Param('itemId', ParseIntPipe) itemId: number, @Body() updateCartItemDto: UpdateCartItemDto) {
        const userId = req.user.id;
        return this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Delete('items/:itemId')
    removeFromCart(@Req() req, @Param('itemId', ParseIntPipe) itemId: number) {
        const userId = req.user.id;
        return this.cartService.removeFromCart(userId, itemId);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Delete('clear')
    clearCart(@Req() req) {
        const userId = req.user.id;
        return this.cartService.clearCart(userId);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get('total')
    getCartTotal(@Req() req) {
        const userId = req.user.id;
        return this.cartService.getCartTotal(userId);
    }
}
