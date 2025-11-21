import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: {
        50: '#fbf9f7',
        100: '#f7f3ef',
        200: '#efe8e0',
        300: '#e6dfd8', // Darker primary for hover
        400: '#dcd3ca',
        500: '#d2c7bc',
        600: '#c8bbae',
        700: '#beafa0',
        800: '#b4a392',
        900: '#aa9784',
      },
      surface: {
        50: '#ffffff',
        100: '#faf9f7',
        200: '#f7f6f3',
        300: '#f0e9e2', // Light primary
      },
      border: '#ece7e1',
      text: {
        main: '#333333',
        secondary: '#666666',
        muted: '#999999',
      },
    },
  },
  shortcuts: [
    ['glass', 'bg-white/80 backdrop-blur-md border border-white/40 shadow-sm'],
    ['glass-hover', 'hover:bg-white/90 transition-colors duration-200'],
    
    ['btn', 'px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'],
    ['btn-primary', 'btn bg-gradient-to-r from-primary-300 to-primary-200 text-text-main font-medium shadow-sm hover:shadow-md hover:from-primary-200 hover:to-primary-100'],
    ['btn-secondary', 'btn bg-white border border-border text-text-main font-medium shadow-sm hover:shadow-md hover:bg-surface-100'],
    ['btn-ghost', 'btn bg-transparent hover:bg-surface-200 text-text-secondary hover:text-text-main'],
    
    ['icon-btn', 'inline-flex items-center justify-center p-2 rounded-full cursor-pointer select-none transition-all duration-200 ease-in-out hover:bg-surface-200 active:scale-90 text-text-secondary hover:text-text-main'],
    
    ['card', 'rounded-xl bg-white border border-border shadow-sm transition-all duration-300 ease-out hover:shadow-md p-6'],
    ['card-glass', 'rounded-xl glass transition-all duration-300 ease-out hover:shadow-md'],
    
    ['input', 'w-full border border-border rounded-lg px-4 py-2.5 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200'],
    
    ['chip', 'px-3 py-1 rounded-full bg-surface-200 text-text-secondary text-xs font-medium transition-colors duration-200'],
    ['chip-active', 'bg-primary-200 text-text-main'],
  ],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans:400,500,700',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
