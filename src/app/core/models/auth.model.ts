// src/app/core/models/auth.model.ts

export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    name: string; // Ou username, selon ton API
    email: string;
    password: string;
  }
  
  // Adapte cette interface à la réponse exacte de ton API après connexion
  export interface AuthResponse {
    token: string;
    userId?: string; // Optionnel: si l'API retourne l'ID utilisateur
    userName?: string; // Optionnel
    expiresIn?: number; // Optionnel: durée de validité du token
  }
  