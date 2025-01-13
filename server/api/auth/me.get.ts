import { H3Event } from 'h3'; // Importation du type H3Event pour typage des événements dans Nuxt 3
import jwt from 'jsonwebtoken'; // Importation de la bibliothèque jsonwebtoken pour la gestion des jetons JWT
import { User } from '~/server/models/User'; // Importation du modèle User pour accéder aux données utilisateur

export default defineEventHandler(async (event: H3Event) => { // Définition de l'événement d'API qui gère la requête HTTP
  const authHeader = event.req.headers['authorization']; // Récupère l'en-tête 'Authorization' de la requête HTTP

  if (!authHeader) { // Vérifie si l'en-tête 'Authorization' est présent dans la requête
    throw createError({
      statusCode: 401, // Si l'en-tête est manquant, renvoie une erreur 401 (non autorisé)
      message: 'Authorization header is missing' // Message d'erreur indiquant que l'en-tête est absent
    });
  }

  const token = authHeader.split(' ')[1]; // Récupère le jeton après le mot 'Bearer' dans l'en-tête (format 'Bearer <token>')

  try {
    if (!process.env.JWT_SECRET) { // Vérifie si la clé secrète JWT est définie dans les variables d'environnement
      throw createError({
        statusCode: 500, // Si la clé secrète est manquante, renvoie une erreur 500 (erreur serveur interne)
        message: 'JWT secret is not configured' // Message d'erreur indiquant que la clé secrète est absente
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le jeton JWT avec la clé secrète et le décode

    // Type guard pour s'assurer que le décodeur n'a pas retourné une chaîne de caractères
    if (typeof decoded === 'string') { // Si le jeton décrypté est une chaîne, cela signifie que le format du jeton est incorrect
      throw createError({
        statusCode: 401, // Renvoie une erreur 401 si le jeton est invalide
        message: 'Invalid token format' // Message d'erreur indiquant un format de jeton invalide
      });
    }

    // Maintenant que nous savons que 'decoded' est de type JwtPayload (un objet et non une chaîne)
    event.context.auth = { userId: decoded.userId }; // Ajoute l'ID utilisateur extrait du jeton au contexte de l'événement

    // Continue avec la logique de récupération de l'utilisateur à partir de la base de données
    const user = await User.findById(decoded.userId).select('-password'); // Cherche l'utilisateur en utilisant l'ID et exclut le mot de passe
    if (!user) { // Vérifie si l'utilisateur est trouvé
      throw createError({
        statusCode: 404, // Si l'utilisateur n'est pas trouvé, renvoie une erreur 404 (non trouvé)
        message: 'User not found' // Message d'erreur indiquant que l'utilisateur est introuvable
      });
    }

    return user; // Renvoie les données de l'utilisateur trouvé

  } catch (error) { // Si une erreur se produit pendant le processus
    throw createError({
      statusCode: 401, // En cas d'erreur (jeton invalide ou expiré), renvoie une erreur 401
      message: 'Invalid or expired token' // Message d'erreur pour un jeton invalide ou expiré
    });
  }
});
