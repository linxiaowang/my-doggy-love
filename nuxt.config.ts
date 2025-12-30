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
 vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    vapidPrivateKey: process.env.NUXT_VAPID_PRIVATE_KEY,
    vapidSubject: process.env.NUXT_VAPID_SUBJECT,
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
    },
    // 减少构建并行度，避免内存耗尽
    workers: {
      threadCount: 1,
    },
    // 严格的类型检查，避免类型循环导致的卡顿
    typescript: {
      strict: false,
      typeCheck: false,
    },
  },

  // 优化 Vite 构建
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      // 减少并行构建
      parallel: false,
      // 优化依赖预构建
      optimizeDeps: {
        include: [
          'vue',
          'pinia',
          '@vueuse/core',
          'class-variance-authority',
          '@vueuse/core',
        ],
        // 排除一些可能导致问题的包
        exclude: [],
      },
      // 减少打包模块数量
      rollupOptions: {
        onwarn(warning, warn) {
          // 忽略某些警告
          if (warning.code === 'CIRCULAR_DEPENDENCY') return
          if (warning.code === 'EMPTY_BUNDLE') return
          warn(warning)
        },
        output: {
          // 手动分块，避免单个包过大
          manualChunks(id) {
            // vendor 相关
            if (id.includes('node_modules')) {
              // 将 UI 组件单独打包
              if (id.includes('components/ui')) {
                return 'ui-components'
              }
              // 其他依赖
              return 'vendor'
            }
          },
        },
      },
    },
    // SSR 构建优化
    ssr: {
      // 优化 SSR 构建的外部化
      noExternal: [
        '@vueuse/core',
        '@vueuse/nuxt',
        'class-variance-authority',
      ],
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
    // 禁用构建时的 ESLint 检查，加快构建速度
    lintOnBuild: false,
  },

  pwa,
})
