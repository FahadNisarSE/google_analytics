// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@sidebase/nuxt-auth"],

  // @ts-ignore
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },

  css: ["~/assets/css/tailwind.css"],

  auth: {
    isEnabled: true,
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    authOrigin: process.env.AUTH_ORIGIN,
  },

  devtools: {
    enabled: true,
  },

  compatibilityDate: "2024-07-12",
});