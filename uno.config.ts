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
  shortcuts: [
    ['btn', 'px-4 py-2 rounded inline-block bg-#e9e4de text-#333 cursor-pointer hover:bg-#e1dbd4 active:scale-98 disabled:cursor-default disabled:opacity-50 transition-all duration-200 ease-out'],
    ['btn-primary', 'px-5 py-2.5 rounded-full bg-gradient-to-r from-#f0e9e2 to-#e6dfd8 text-#333 font-medium shadow-sm hover:shadow-md hover:from-#e6dfd8 hover:to-#ddd6cf active:scale-98 transition-all duration-200 ease-out'],
    ['btn-secondary', 'px-5 py-2.5 rounded-full bg-white border border-#ece7e1 text-#333 font-medium shadow-sm hover:shadow-md hover:bg-#f8f7f5 hover:border-#ddd6cf active:scale-98 transition-all duration-200 ease-out'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition-all duration-200 ease-in-out hover:opacity-100 hover:text-#7b7b7b active:scale-95'],
    ['card', 'rounded-xl bg-white shadow-sm hover:shadow-md p-4 border border-#ece7e1 transition-all duration-300 ease-out'],
    ['card-heading', 'text-#333 text-base font-medium'],
    ['muted', 'text-#777'],
    ['input', 'border border-#ece7e1 rounded-lg px-4 py-2.5 bg-white text-#333 placeholder:text-#9aa0a6 focus:outline-none focus:ring-2 focus:ring-#e6eef5 focus:border-#d4d8e0 transition-all duration-200'],
    ['chip', 'px-3 py-1 rounded-full bg-#f3efe9 text-#666 text-xs font-medium hover:bg-#e9e4de transition-colors duration-200'],
    ['chip-success', 'px-3 py-1 rounded-full bg-#e7f6ec text-#127a3e text-xs font-medium'],
  ],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
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
