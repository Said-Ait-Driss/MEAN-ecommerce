import { Routes } from '@angular/router';
import { Cart } from './features/cart/cart/cart';
import { Checkout } from './features/checkout/checkout/checkout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Home } from './features/home/home/home';
import { Shop } from './features/products/shop/shop';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cart', component: Cart },
  { path: 'shop', component: Shop },
  { path: 'checkout', component: Checkout },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' },
];
