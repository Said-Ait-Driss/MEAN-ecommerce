import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
    @IsArray()
    items: OrderItemDto[];
}

export class OrderItemDto {
    @IsNumber()
    productId: number;

    @IsNumber()
    quantity: number;
}
