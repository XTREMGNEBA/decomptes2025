import { hashPassword } from '../utils/auth';
import { User } from '../models/User'; // Vérifiez que ce chemin correspond à votre structure de projet
import { connectDB } from '../utils/db'; // Vérifiez également ce chemin

export default defineNitroPlugin(async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    console.log('✅ Connexion MongoDB établie');

    // Vérification/création du compte administrateur
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
    const adminLastName = process.env.ADMIN_LAST_NAME || 'User';

    if (!adminEmail) {
      throw new Error('❌ ADMIN_EMAIL est manquant dans les variables d\'environnement');
    }

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await hashPassword(adminPassword);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: 'admin',
        status: 'active',
      });
      console.log('✅ Compte administrateur créé');
    } else {
      console.log('✅ Compte administrateur déjà existant');
    }
  } catch (error:any) {
    console.error('❌ Erreur d\'initialisation :', error.message || error);
    throw error;
  }
});
