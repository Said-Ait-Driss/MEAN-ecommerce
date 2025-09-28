import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  testimonials = [
    {
      name: 'Sarah M.',
      feedback: 'Absolutely love this store! Fast shipping and amazing quality.',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'James K.',
      feedback: 'The best shopping experience I’ve had in years. Highly recommend!',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    {
      name: 'Olivia P.',
      feedback: 'Fantastic deals and very user-friendly checkout process.',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
  ];
}
