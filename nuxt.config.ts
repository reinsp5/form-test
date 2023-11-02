// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare-pages"
  },
  runtimeConfig: {
    dkimPrivateKey: process.env.DKIM_PRIVATE_KEY,
    ownerMailAddr: process.env.OWNER_MAIL_ADDR || "",
    senderName: process.env.SENDER_NAME || "",
    senderMailAddr: process.env.SENDER_MAIL_ADDR || "",
    public: {
      domain: process.env.PUBLIC_DOMAIN || "",
    }
  },
})
