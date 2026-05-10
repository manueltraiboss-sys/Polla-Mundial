import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login-component/login-component';
import { RegisterComponent } from './Components/register-component/register-component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/login' }
];
