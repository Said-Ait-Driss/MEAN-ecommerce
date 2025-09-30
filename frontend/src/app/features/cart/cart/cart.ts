import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  constructor(private router: Router) {}

  cart: CartItem[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99,
      image: 'https://imageplaceholder.net/600x400/f0f0f0/131313?text=headphones',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Smartwatch',
      price: 149,
      image: 'https://imageplaceholder.net/600x400/f0f0f0/131313?text=Smart+watch',
      quantity: 2,
    },
  ];

  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(item: CartItem, event: any) {
    const newQuantity = +event.target.value;
    if (newQuantity >= 1) {
      item.quantity = newQuantity;
    }
  }

  removeItem(id: number) {
    this.cart = this.cart.filter((item) => item.id !== id);
  }

  // process to checkout
  proceedToCheckout() {
    // 📝 TODO: Add validation (e.g. check if cart is empty, save cart state, etc.)
    console.log('Proceeding to checkout...');

    // Redirect to checkout page
    this.router.navigate(['/checkout']);
  }
}
