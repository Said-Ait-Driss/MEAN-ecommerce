import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
}

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  product: Product = {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and long battery life.',
    price: 99,
    images: [
      'https://imageplaceholder.net/600x400/eeeeee/131313?text=Wireless+Headphones&tag=summer',
      'https://imageplaceholder.net/600x400/f0f0f0/4fe8b8?text=Wireless+Headphones&tag=summer',
      'https://imageplaceholder.net/600x400/f4f4f4/7c7c7c?text=Wireless+Headphones&tag=summer',
    ],
  };

  selectedImage = this.product.images[0];
  quantity: number = 1;

  constructor(private route: ActivatedRoute) {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID from route:', productId);
    // TODO: fetch product by ID from ProductsService
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }

  addToCart() {
    console.log(`Added ${this.quantity} x ${this.product.name} to cart`);
    // TODO: use CartService to add product
  }
}
