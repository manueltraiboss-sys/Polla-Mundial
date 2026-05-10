import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Signal reactivo — la UI se actualiza automáticamente al cambiar
  currentUser = signal<User | null>(null);

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Al iniciar la app, recupera la sesión guardada
    this.loadSession();

    // Escucha cambios de sesión en tiempo real (login, logout, expiración)
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  private async loadSession(): Promise<void> {
    const { data } = await this.supabaseService.client.auth.getSession();
    this.currentUser.set(data.session?.user ?? null);
  }

  // REGISTRO
   // ─── NUEVO: acepta username además de email/password ───────────────────
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,          // se guarda en auth.users → raw_user_meta_data
          display_name: username
        }
      }
    });

    if (error) throw error;
    return data;
  }

  // INICIO DE SESIÓN
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth
      .signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  // CIERRE DE SESIÓN
  async signOut() {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (error) throw error;
    this.router.navigate(['/auth/login']);
  }

  // ¿Está autenticado?
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

}
