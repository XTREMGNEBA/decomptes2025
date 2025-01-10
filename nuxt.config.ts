export default defineNuxtConfig({
  // Désactive les outils de développement Nuxt
  devtools: { enabled: false },

  // Importe le fichier CSS Tailwind
  css: ['~/assets/css/tailwind.css','~/assets/css/style.css'],

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
  ],

  // Configuration de Tailwind CSS
  tailwindcss: {
    configPath: '~/tailwind.config.mjs',
  },

  // Configuration de PostCSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Configuration de Nuxt UI
  ui: {
    global: true,
  },

  // Configuration de Nitro (backend)
  nitro: {
    plugins: ['~/server/plugins/mongodb.ts'],
  },

  // Configuration runtime (variables d'environnement)
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    public: {
      apiBase: process.env.API_BASE || '/api',
    },
  },

  // Configuration de l'application
  app: {
    head: {
      title: 'decomptes2025',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Application de gestion des décomptes multi-organisationnels' },
      ],
    },
  },

  // Configuration du serveur de développement
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: '0.0.0.0',
        port: 24678
      }
    }
  },

  // Configuration des options de développement
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },

  compatibilityDate: '2025-01-08',
})