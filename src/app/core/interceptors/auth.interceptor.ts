import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
// Importe ton service d'authentification si tu l'utilises pour gérer le token
// import { AuthService } from '../services/auth.service';

/**
 * Intercepteur fonctionnel pour ajouter le token d'authentification aux requêtes.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Injecte ton AuthService si besoin
  // const authService = inject(AuthService);
  // const authToken = authService.getToken();

  // --- Alternative: Récupérer le token depuis localStorage (exemple simple) ---
  const authToken = localStorage.getItem('authToken'); // Remplace 'authToken' par la clé que tu utilises

  // Si le token existe, clone la requête pour ajouter le header Authorization
  if (authToken) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      // Alternative si tu utilises setHeaders (remplace tous les headers existants)
      // setHeaders: {
      //   Authorization: `Bearer ${authToken}`
      // }
    });
    // Passe la requête clonée au prochain handler
    return next(clonedReq);
  }

  // Si pas de token, passe la requête originale
  return next(req);
};
