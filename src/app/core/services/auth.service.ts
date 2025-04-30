// src/app/core/services/auth.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development'; // Ajuste le chemin si besoin
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model'; // Ajuste le chemin si besoin

const AUTH_TOKEN_KEY = 'authToken'; // Clé pour localStorage

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // URL de base pour l'authentification (ajuste selon ton API)
  private authApiUrl = `${environment.apiUrl}/auth`; // Use environment.apiUrl

  // Signal pour suivre l'état d'authentification (moderne et réactif)
  // Initialise en vérifiant si un token existe déjà
  isAuthenticated = signal<boolean>(this.hasToken());

  /**
   * Tente de connecter un utilisateur.
   * @param credentials Les informations de connexion.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.saveToken(response.token); // Sauvegarde le token
          this.isAuthenticated.set(true); // Met à jour le signal
          console.log('Login successful');
        }),
        catchError(this.handleError) // Gère les erreurs
      );
  }

  /**
   * Enregistre un nouvel utilisateur.
   * @param userData Les informations d'inscription.
   */
  register(userData: RegisterRequest): Observable<any> { // Adapte 'any' au type de réponse de ton API (peut-être void ou infos utilisateur)
    return this.http.post<any>(`${this.authApiUrl}/register`, userData)
      .pipe(
        tap(() => {
          console.log('Registration successful');
          // Optionnel: Connecter l'utilisateur automatiquement après inscription ?
          // Ou simplement rediriger vers la page de connexion
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Déconnecte l'utilisateur actuel.
   */
  logout(): void {
    this.removeToken(); // Supprime le token
    this.isAuthenticated.set(false); // Met à jour le signal
    this.router.navigate(['/auth']); // Redirige vers la page de connexion/auth
    console.log('Logged out');
  }

  /**
   * Récupère le token d'authentification stocké.
   * @returns Le token ou null s'il n'existe pas.
   */
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') { // Vérifie si localStorage est disponible (utile pour SSR)
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Vérifie si un token est actuellement stocké.
   * Note: Ceci ne vérifie pas la validité du token (expiration, etc.).
   * @returns true si un token existe, false sinon.
   */
  private hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Sauvegarde le token dans le localStorage.
   * @param token Le token JWT à sauvegarder.
   */
  private saveToken(token: string): void {
     if (typeof localStorage !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
     }
  }

  /**
   * Supprime le token du localStorage.
   */
  private removeToken(): void {
     if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
     }
  }

  /**
   * Gestionnaire d'erreurs HTTP simple.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue !';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Le backend a retourné un code d'erreur
      // L'API peut envoyer des détails sur l'erreur
      errorMessage = `Code d'erreur ${error.status}: ${error.message}`;
      if (error.status === 401) {
         errorMessage = 'Authentification échouée. Vérifiez vos identifiants.';
         // Optionnel: Déconnecter l'utilisateur si le token est invalide
         // this.logout();
      }
      // Tu peux ajouter d'autres vérifications de statut ici (400, 404, 500...)
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Retourne un observable d'erreur
  }
}
