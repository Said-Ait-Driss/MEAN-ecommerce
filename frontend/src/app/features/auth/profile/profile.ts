import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/placeholder-avatar-male.jpg',
  };

  isEditing = false;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    console.log('Profile updated:', this.user);
    this.isEditing = false;
    // TODO: call AuthService to save changes
  }
}
