import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Liste des dossiers à exclure
const EXCLUDED_DIRS = [
  'node_modules',
  '.nuxt',
  '.bolt',
  '.output',
  'node',
  '.git'
];

async function findAndRenameFiles(startPath) {
  try {
    // Lire le contenu du répertoire
    const files = await fs.readdir(startPath);

    for (const file of files) {
      const filePath = join(startPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        // Vérifier si le dossier est dans la liste des exclus
        if (EXCLUDED_DIRS.includes(file)) {
          console.log(`🚫 Ignoré: ${filePath}`);
          continue;
        }
        // Récursion pour les sous-répertoires
        await findAndRenameFiles(filePath);
      } else if (file.endsWith('05.js')) {
        // Traiter les fichiers se terminant par 05.js
        const newPath = filePath.replace(/05\.js$/, '.vue');
        
        // Lire le contenu du fichier
        let content = await fs.readFile(filePath, 'utf8');

        // Vérifier si le contenu commence déjà par <template>
        if (!content.trim().startsWith('<template>')) {
          // Si le contenu est enveloppé dans des backticks, les retirer
          content = content.replace(/^```(vue)?\n/, '').replace(/\n```$/, '');
        }

        // Écrire le contenu dans le nouveau fichier
        await fs.writeFile(newPath, content, 'utf8');
        
        // Supprimer l'ancien fichier
        await fs.unlink(filePath);
        
        console.log(`✅ Converti: ${filePath} -> ${newPath}`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Point d'entrée du script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
console.log('🔍 Début de la conversion des fichiers...');

findAndRenameFiles(projectRoot)
  .then(() => console.log('✨ Conversion terminée avec succès!'))
  .catch(error => console.error('❌ Erreur lors de la conversion:', error));
