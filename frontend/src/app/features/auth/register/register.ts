import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  name = '';
  email = '';
  password = '';

  onRegister() {
    console.log('Register with:', this.name, this.email, this.password);
    // TODO: Call AuthService.register()
  }
}
