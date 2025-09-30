import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async getOrCreateCart(userId: number) {
        let cart = await this.prisma.cart.findUnique({
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
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: { category: true },
                            },
                        },
                    },
                },
            });
        }

        return cart;
    }

    async addToCart(userId: number, addToCartDto: AddToCartDto) {
        const { productId, quantity } = addToCartDto;

        // Check if product exists and has enough stock
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        if (product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        const cart = await this.getOrCreateCart(userId);

        // Check if item already exists in cart
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        });

        if (existingItem) {
            // Update quantity if item exists
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
                include: {
                    product: {
                        include: { category: true },
                    },
                },
            });
        } else {
            // Create new cart item
            return this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
                include: {
                    product: {
                        include: { category: true },
                    },
                },
            });
        }
    }

    async updateCartItem(userId: number, itemId: number, updateCartItemDto: UpdateCartItemDto) {
        const { quantity } = updateCartItemDto;

        if (quantity <= 0) {
            return this.removeFromCart(userId, itemId);
        }

        const cart = await this.getOrCreateCart(userId);
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
            include: { product: true },
        });

        if (!cartItem) {
            throw new NotFoundException(`Cart item with ID ${itemId} not found`);
        }

        if (cartItem.product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: {
                product: {
                    include: { category: true },
                },
            },
        });
    }

    async removeFromCart(userId: number, itemId: number) {
        const cart = await this.getOrCreateCart(userId);
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });

        if (!cartItem) {
            throw new NotFoundException(`Cart item with ID ${itemId} not found`);
        }

        return this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }

    async clearCart(userId: number) {
        const cart = await this.getOrCreateCart(userId);

        return this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
    }

    async getCartTotal(userId: number) {
        const cart = await this.getOrCreateCart(userId);

        let total = 0;
        for (const item of cart.items) {
            total += item.quantity * item.product.price;
        }

        return { total, items: cart.items };
    }
}
