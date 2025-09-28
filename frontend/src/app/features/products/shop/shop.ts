import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-shop',
  imports: [FormsModule, TitleCasePipe, ProductCard],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  products = [
    {
      name: 'Wireless Headphones',
      price: 99.99,
      image:
        'https://imageplaceholder.net/600x400/eeeeee/131313?text=Wireless+Headphones&tag=summer',
    },
    {
      name: 'Smart Watch',
      price: 149.99,
      image: 'https://imageplaceholder.net/600x400/f0f0f0/131313?text=Smart+Watch',
    },
    {
      name: 'Gaming Mouse',
      price: 49.99,
      image: 'https://imageplaceholder.net/600x400/f0f0f0/131313?text=Gaming+Mouse',
    },
    {
      name: 'Mechanical Keyboard',
      price: 89.99,
      image: 'https://imageplaceholder.net/600x400/f0f0f0/131313?text=Keyboard',
    },
    {
      name: 'Mechanical Keyboard',
      price: 55.99,
      image: 'https://imageplaceholder.net/600x400/f0f0f0/131313?text=Keyboard',
    },
  ];

  // Filters
  selectedCategory: string = 'all';
  priceRange: number = 500;

  // Sorting
  sortOption: string = 'newest';

  // Display type
  display: 'grid' | 'list' = 'grid';

  categories = ['all', 'electronics', 'clothing', 'accessories', 'home'];

  // Example: Hook this to your existing product list logic
  onFilterChange() {
    console.log('Filter:', this.selectedCategory, 'Price <=', this.priceRange);
    // Call service / update products
  }

  onSortChange() {
    console.log('Sort:', this.sortOption);
    // Call service / reorder products
  }

  toggleDisplay(view: 'grid' | 'list') {
    this.display = view;
  }
}
