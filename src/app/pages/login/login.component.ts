import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CustomerLoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials: CustomerLoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.customerLogin(credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/dashboard']);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('E-mail ou senha inválidos.');
        } else {
          this.errorMessage.set('Ocorreu um erro. Tente novamente.');
        }
      }
    });
  }

  onGoogleLogin(): void {
    // Google OAuth integration point
    console.log('Google login');
  }

  onAppleLogin(): void {
    // Apple OAuth integration point
    console.log('Apple login');
  }
}
