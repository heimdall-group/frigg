// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: '' },
        { name: 'authors', content: '' },
        { name: 'keywords', content: '' },
      ],
      script: [
      ],
    },
  },
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      recaptcha_v3: process.env.RECAPTCHA_V3_KEY,
      recaptcha_v2: process.env.RECAPTCHA_V2_KEY,
    },
    mongoUrl: process.env.MONGO_URL,
    recaptcha_v3_secret: process.env.RECAPTCHA_V3_SECRET_KEY,
    recaptcha_v2_secret: process.env.RECAPTCHA_V2_SECRET_KEY,
  },
  nitro: {
    preset: 'digital-ocean',
    plugins: ['~/server/index.js'],
  },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['mainStore'],
      },
    ],
    ["nuxt-security", {
      headers: {
        crossOriginEmbedderPolicy: true,
        contentSecurityPolicy: false,
      }
    },],
  ],
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
});
