// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", ['@pinia/nuxt', {
    autoImports: [
      // 自动引入 `defineStore()`
      'defineStore',
      // 自动引入 `defineStore()` 并重命名为 `definePiniaStore()`
      ['defineStore', 'definePiniaStore'],
    ],
  },]],
  css: [
    "remixicon/fonts/remixicon.css",
    '~/assets/css/global.css'
  ],
  serverHandlers: [
  ]
})
