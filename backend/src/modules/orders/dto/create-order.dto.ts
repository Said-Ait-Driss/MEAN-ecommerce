export class CreateOrderDto {
    items: OrderItemDto[];
}

export class OrderItemDto {
    productId: number;
    quantity: number;
}
