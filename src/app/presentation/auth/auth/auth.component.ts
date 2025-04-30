import { Component, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router); // Inject Router
  private destroyRef = inject(DestroyRef);

  isLoginMode = true; // Défaut à true (mode connexion)

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    // S'abonner aux queryParams et gérer automatiquement la désinscription
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef)) // Se désabonne automatiquement
      .subscribe(params => {
        const mode = params['mode'];
        this.isLoginMode = mode !== 'register';
        console.log(`Query param 'mode': ${mode}, isLoginMode set to: ${this.isLoginMode}`); // Log pour débogage
      });
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login Form Submitted:', this.loginForm.value);
      // TODO: Implémenter la logique de connexion
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSubmitRegister(): void {
    if (this.registerForm.valid) {
      console.log('Register Form Submitted:', this.registerForm.value);
      // TODO: Implémenter la logique d'inscription
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;

    // Met à jour l'URL sans recharger la page
    this.router.navigate([], {
      relativeTo: this.route, // Important pour rester sur la même route
      queryParams: { mode: this.isLoginMode ? 'login' : 'register' },
      queryParamsHandling: 'merge', // Conserve les autres queryParams s'il y en a
      // replaceUrl: true // Optionnel: remplace l'entrée dans l'historique du navigateur
    });
  }
}
