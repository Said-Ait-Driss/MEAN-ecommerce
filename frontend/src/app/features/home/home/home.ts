import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { Featured } from '../featured/featured';
import { Testimonials } from '../testimonials/testimonials';
import { Newsletter } from '../newsletter/newsletter';

@Component({
  selector: 'app-home',
  imports: [Hero, Featured, Testimonials, Newsletter],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
