import { Component } from '@angular/core';
import { AuthService } from '../../Service/auth-service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  // FormBuilder es un helper que simplifica crear FormGroups
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          '',                           // valor inicial
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            // Solo letras, números y guión bajo
            Validators.pattern(/^[a-zA-Z0-9_]+$/)
          ]
        ],
        email: [
          '',
          [Validators.required, Validators.email]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],
        confirmPassword: [
          '',
          Validators.required
        ]
      },
      {
        // El validador de grupo se aplica al FormGroup completo,
        // no a un campo individual
        validators: passwordMatchValidator()
      }
    );
  }

  // Atajos para acceder a los controles desde el HTML
  get username() { return this.registerForm.get('username')!; }
  get email()    { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }

  async onSubmit() {
    // Si el formulario tiene errores, no hacemos nada
    // (markAllAsTouched hace que se muestren todos los errores de una vez)
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { username, email, password } = this.registerForm.value;
      await this.authService.signUp(email, password, username);

      // Registro exitoso — mostramos mensaje y redirigimos
      this.successMessage = '¡Cuenta creada! Redirigiendo...';
      setTimeout(() => this.router.navigate(['/dashboard']), 1500);

    } catch (error: any) {
      // Supabase devuelve mensajes en inglés — los traducimos
      this.errorMessage = this.translateError(error.message);
    } finally {
      this.loading = false;
    }
  }

  private translateError(message: string): string {
    const errors: Record<string, string> = {
      'User already registered': 'Este email ya está registrado.',
      'Password should be at least 6 characters':
        'La contraseña debe tener al menos 8 caracteres.',
      'Unable to validate email address: invalid format':
        'El formato del email no es válido.'
    };
    return errors[message] ?? 'Ocurrió un error. Intenta de nuevo.';
  }
}
