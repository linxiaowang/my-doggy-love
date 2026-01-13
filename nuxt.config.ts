import { pwa } from './app/config/pwa'
import { appDescription } from './app/constants/index'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
   '@vueuse/nuxt',
   '@pinia/nuxt',
   '@nuxtjs/color-mode',
   '@vite-pwa/nuxt',
   // '@nuxt/eslint', // 暂时禁用以加快构建速度
   'shadcn-nuxt',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },
  css: ['~/assets/css/tailwind.css'],
  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    vapidPrivateKey: process.env.NUXT_VAPID_PRIVATE_KEY,
    vapidSubject: process.env.NUXT_VAPID_SUBJECT,
    databaseUrl: process.env.DATABASE_URL,
    uploadDir: process.env.UPLOAD_DIR,
    authSecret: process.env.AUTH_SECRET,
    public: {
      vapidPublicKey: process.env.NUXT_PUBLIC_VAPID_KEY,
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/maskable-icon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#faf9f5' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0f0e0a' },
      ],
    },
  },

  colorMode: {
    classSuffix: '',
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',

  sourcemap: {
    server: false,
    client: false,
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: [],
    },
    // 将 sharp 标记为外部依赖，避免在构建时打包原生模块
    // sharp 会在运行时动态加载（使用动态 import）
    // 这样可以避免构建时编译原生模块导致的卡顿
    rollupConfig: {
      external: (id) => {
        // 排除 sharp 及其依赖
        if (id === 'sharp' || id.startsWith('sharp/')) {
          return true
        }
        // 排除一些可能导致构建卡顿的可选依赖
        if (id.includes('optional')) {
          return true
        }
        return false
      },
    },
    // 禁用一些可能导致构建卡顿的功能
    experimental: {
      openAPI: false,
      wasm: false,
      // 启用 WebSocket 支持
      websocket: true,
    },
    // 严格的类型检查，避免类型循环导致的卡顿
    typescript: {
      strict: false,
    },
  },

  // 优化 Vite 构建
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  pwa,
})
