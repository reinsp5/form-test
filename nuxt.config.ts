// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare-pages"
  },
  runtimeConfig: {
    DKIM_PRIVATE_KEY: process.env.DKIM_PRIVATE_KEY,
  },
})
