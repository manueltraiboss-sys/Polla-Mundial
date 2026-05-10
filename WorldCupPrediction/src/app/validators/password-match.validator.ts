// src/app/shared/validators/password-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ValidatorFn es el tipo que Angular espera para un validador
// Recibe el FormGroup completo y devuelve null (válido) o un objeto de error
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Buscamos los dos controles dentro del grupo
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // Si alguno no existe todavía, no validamos
    if (!password || !confirmPassword) return null;

    // Si no coinciden, devolvemos un error con la clave 'passwordMismatch'
    if (password.value !== confirmPassword.value) {
      // Asignamos el error directamente en confirmPassword para mostrarlo ahí
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Si coinciden y el único error era ese, lo limpiamos
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null; // null = formulario válido en este aspecto
  };
}