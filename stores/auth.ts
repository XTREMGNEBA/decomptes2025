//store/auth.ts
import { defineStore } from 'pinia'; // Importation de Pinia pour définir un store d'état global dans l'application

interface User { // Interface TypeScript pour décrire la structure d'un utilisateur
  _id: string; // Changed from 'id' to '_id' to match MongoDB document
  email: string; // Email de l'utilisateur
  firstName: string; // Prénom de l'utilisateur (required based on model)
  lastName: string; // Nom de l'utilisateur (required based on model)
  role: 'admin' | 'validator' | 'auditor' | 'signer'; // Rôle de l'utilisateur avec les types spécifiques du modèle
  organism?: string; // Organisme auquel l'utilisateur appartient (optionnel)
  status?: 'active' | 'inactive';
  lastLogin?: Date;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const useAuthStore = defineStore('auth', { // Définition du store 'auth' pour la gestion de l'authentification
  state: () => ({ // Définition de l'état initial du store
    token: null as string | null, // Le jeton d'authentification, initialement null
    user: null as User | null, // L'utilisateur, initialement null
    loading: false // Indicateur de chargement pour les actions asynchrones
  }),

  getters: { // Définition des getters pour récupérer des informations calculées
    isAuthenticated: (state) => !!state.token && !!state.user, // Vérifie si l'utilisateur est authentifié (jeton et utilisateur présents)
    isAdmin: (state) => state.user?.role === 'admin' // Vérifie si l'utilisateur est un administrateur
  },

  actions: { // Définition des actions du store qui modifient l'état ou effectuent des tâches asynchrones
    async login(email: string, password: string) { // Action pour connecter un utilisateur avec email et mot de passe
      this.loading = true; // Active l'indicateur de chargement
      try {
        const response = await $fetch('/api/auth/login', { // Effectue une requête POST vers l'API de connexion
          method: 'POST', // Méthode POST pour envoyer les informations de connexion
          body: { email, password } // Corps de la requête contenant l'email et le mot de passe
        });

        if (!response.token || !response.user) { // Vérifie que la réponse contient un jeton et un utilisateur
          throw new Error('Invalid credentials'); // Lance une erreur si les informations sont incorrectes
        }

        // Validate that the user object has all required properties
        const user = response.user as User;
        if (!user._id || !user.email || !user.firstName || !user.lastName || !user.role) {
          throw new Error('Incomplete user information');
        }

        this.setAuth(response.token, user); // Si la connexion réussit, configure le jeton et l'utilisateur dans l'état
        return navigateTo(this.isAdmin ? '/' : '/decomptes'); // Redirige l'utilisateur vers la page appropriée en fonction du rôle
      } catch (error: any) { // Gère les erreurs en cas d'échec de la connexion
        throw new Error(error.data?.message || 'Login failed'); // Lance une erreur avec un message approprié
      } finally {
        this.loading = false; // Désactive l'indicateur de chargement une fois l'action terminée
      }
    },
    async register(userData: { email: string, password: string, firstName: string, lastName: string, role?: 'admin' | 'validator' | 'auditor' | 'signer' }) {
      this.loading = true; // Active l'indicateur de chargement
      try {
        const { email, password, firstName, lastName, role = 'validator' } = userData;
        const response = await $fetch<AuthResponse>('/api/auth/register', { // Effectue une requête POST vers l'API d'enregistrement
          method: 'POST', // Méthode POST pour envoyer les informations d'enregistrement
          body: { email, password, firstName, lastName, role } // Corps de la requête avec les informations de l'utilisateur
        });
  
        if (!response.token || !response.user) { // Vérifie que la réponse contient un jeton et un utilisateur
          throw new Error('Registration failed'); // Lance une erreur si l'enregistrement échoue
        }
  
        this.setAuth(response.token, response.user); // Si l'enregistrement réussit, configure le jeton et l'utilisateur
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      } finally {
        this.loading = false; // Désactive l'indicateur de chargement une fois l'action terminée
      }
    },
  
    setAuth(token: string, user: User) { // Action pour configurer le jeton et l'utilisateur dans l'état
      this.token = token; // Enregistre le jeton dans l'état
      this.user = user; // Enregistre l'utilisateur dans l'état
      if (process.client) { // Si l'application s'exécute côté client
        localStorage.setItem('auth:token', token); // Enregistre le jeton dans le stockage local du navigateur
        localStorage.setItem('auth:user', JSON.stringify(user)); // Enregistre l'utilisateur dans le stockage local du navigateur
      }
    },

    clearAuth() { // Action pour effacer l'authentification (déconnexion)
      this.token = null; // Efface le jeton
      this.user = null; // Efface les données utilisateur
      if (process.client) { // Si l'application s'exécute côté client
        localStorage.removeItem('auth:token'); // Supprime le jeton du stockage local
        localStorage.removeItem('auth:user'); // Supprime les données utilisateur du stockage local
      }
    },

    async logout() { // Action pour déconnecter l'utilisateur
      this.clearAuth(); // Appelle clearAuth pour effacer l'état d'authentification
      return navigateTo('/login'); // Redirige l'utilisateur vers la page de connexion
    },

    async initAuth() { // Action pour initialiser l'authentification à partir du stockage local
      if (process.client) { // Si l'application s'exécute côté client
        const token = localStorage.getItem('auth:token'); // Récupère le jeton du stockage local
        const userStr = localStorage.getItem('auth:user'); // Récupère les données utilisateur du stockage local
    
        if (token && userStr) { // Si un jeton et des données utilisateur existent
          try {
            const user = JSON.parse(userStr); // Parse les données utilisateur en objet
            this.setAuth(token, user); // Configure le jeton et l'utilisateur dans l'état
            await this.validateToken(); // Valide le jeton en vérifiant son authenticité
          } catch (e) {
            this.clearAuth(); // Si une erreur survient, efface l'authentification
          }
        }
      }
    },

    async validateToken() { // Action pour valider l'authenticité du jeton en envoyant une requête à l'API
      if (!this.token) return false; // Si aucun jeton n'est présent, retourne false
    
      try {
        const user = await $fetch('/api/auth/me', { // Effectue une requête vers l'API pour vérifier le jeton
          headers: { // Ajoute le jeton dans l'en-tête d'autorisation
            Authorization: `Bearer ${this.token}`,
          },
        });
        return !!user; // Si l'utilisateur est valide, retourne true, sinon false
      } catch (error) { // Si une erreur survient (par exemple jeton invalide ou expiré)
        this.clearAuth(); // Efface l'authentification
        return false; // Retourne false si le jeton est invalide ou expiré
      }
    }
  }
});
