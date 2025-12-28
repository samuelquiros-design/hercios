export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "~/assets/scss/partials/_reset.scss" as *;
          @use "~/assets/scss/partials/_fonts.scss" as *;
          @use "~/assets/scss/partials/_vars.scss" as *;
          `
        }
      }
    }
  },
  app: {
    head: {
      title: 'Hercios',
      htmlAttrs: {
        lang: 'es',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.svg' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' }
      ]
    }
  }
})
