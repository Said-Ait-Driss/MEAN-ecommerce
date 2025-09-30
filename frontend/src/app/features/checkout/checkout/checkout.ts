import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  cart: CartItem[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99,
      quantity: 1,
      image: 'https://imageplaceholder.net/600x400/f0f0f0/131313?text=headphones',
    },
    {
      id: 2,
      name: 'Smartwatch',
      price: 149,
      quantity: 2,
      image: 'https://imageplaceholder.net/600x400/f0f0f0/131313?text=Smart+watch',
    },
  ];

  order = {
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  };

  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  placeOrder() {
    console.log('Order placed:', this.order, 'Cart:', this.cart);
    alert('✅ Your order has been placed successfully!');
    // TODO: send order to backend via OrdersService
  }
}
