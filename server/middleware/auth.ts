//server/middleware/auth.ts

import { getHeader, createError, setHeader } from 'h3'; // Importation de fonctions utilitaires depuis 'h3'
import jwt from 'jsonwebtoken'; // Importation de la bibliothèque 'jsonwebtoken'
import { useRuntimeConfig } from '#imports'; // Pour récupérer la configuration de l'environnement (par exemple, la clé secrète JWT)

export default defineEventHandler(async (event) => { // Définition d'un gestionnaire d'événements pour l'authentification
  const config = useRuntimeConfig(); // Récupère la configuration de l'application (notamment la clé secrète du JWT)
  
  // Liste des routes publiques qui n'ont pas besoin de validation d'authentification
  const publicPaths = [
    '/', '/login', '/register', // Routes publiques de base
    '/api/auth/login', '/api/auth/register', // API de connexion et d'enregistrement
    '/api/_nuxt_icon', '/_nuxt', // Routes liées à Nuxt.js
  ];

  // Si la route demandée est dans la liste des routes publiques, on la laisse passer sans validation
  if (publicPaths.some((path) => event.path.startsWith(path))) {
    setHeader(event, 'Cache-Control', 'public, max-age=3600'); // Ajout d'un en-tête de contrôle de cache
    return; // Pas besoin de valider le token
  }

  try {
    // Récupère l'en-tête d'authentification 'Authorization'
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader) { // Si l'en-tête 'authorization' est absent
      throw createError({
        statusCode: 401, // Non autorisé
        message: 'Accès non autorisé : aucun token trouvé', // Message d'erreur
      });
    }

    // Extraction du token à partir de l'en-tête 'Authorization' (format 'Bearer <token>')
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) { // Si le token est mal formaté ou manquant
      throw createError({
        statusCode: 401, // Non autorisé
        message: 'Format de token invalide', // Message d'erreur
      });
    }

    // Vérification de la validité du token avec la clé secrète définie dans la configuration
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Attache les informations du token décodé à l'événement pour les utiliser plus tard dans l'application
    event.context.auth = decoded;

  } catch (error: any) {
    // En cas d'erreur (token invalide, expiré, ou problème de validation)
    console.error('Erreur de validation du token:', error.message);
    throw createError({
      statusCode: 401, // Non autorisé
      message: 'Token invalide ou expiré', // Message d'erreur
    });
  }
});
