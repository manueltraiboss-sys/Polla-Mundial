import { Component } from '@angular/core';
import { AuthService } from '../../Service/auth-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
   email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    this.errorMessage = '';
    this.loading = true;
    try {
      await this.authService.signIn(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
