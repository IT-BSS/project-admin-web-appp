// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  modules: ['@pinia/nuxt', '@nuxtjs/google-fonts', '@nuxt/image'],
  
  googleFonts: {
    families: {
      Montserrat: [100, 300, 400, 500, 600, 700, 800, 900], 
    },
    display: 'swap', 
    preconnect: true,
    download: false,
  },

  devServer: {
    port: 8080,
    host: '0.0.0.0'
  },
  nitro: {
    preset: 'node-server',
    port: 8080,
    host: '0.0.0.0'
  },
    runtimeConfig: {
        apiSecret: process.env.API_SECRET || '',
        public: {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
            apiTimeout: parseInt(process.env.API_TIMEOUT || '10000'),
            apiRetryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
        }
    },

})