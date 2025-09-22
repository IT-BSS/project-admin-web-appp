// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
  ],

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
  }
})
