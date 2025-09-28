import { Component } from '@angular/core';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-featured',
  imports: [ProductCard],
  templateUrl: './featured.html',
  styleUrl: './featured.scss',
})
export class Featured {
  featuredProducts = [
    {
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://imageplaceholder.net/600x400',
    },
    { name: 'Smart Watch', price: 149.99, image: 'https://imageplaceholder.net/600x400' },
    { name: 'Gaming Mouse', price: 49.99, image: 'https://imageplaceholder.net/600x400' },
    { name: 'Mechanical Keyboard', price: 89.99, image: 'https://imageplaceholder.net/600x400' },
  ];
}
