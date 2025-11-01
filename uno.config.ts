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
    ['btn', 'px-4 py-2 rounded inline-block bg-#e9e4de text-#333 cursor-pointer hover:bg-#e1dbd4 disabled:cursor-default disabled:opacity-50 transition duration-150'],
    ['btn-primary', 'px-4 py-2 rounded-full bg-#f0e9e2 text-#333 hover:bg-#e6dfd8 transition duration-150'],
    ['btn-secondary', 'px-4 py-2 rounded-full bg-white border border-#ece7e1 text-#333 hover:bg-#f8f7f5 transition duration-150'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-#7b7b7b'],
    ['card', 'rounded-xl bg-white shadow p-4 border border-#ece7e1'],
    ['card-heading', 'text-#333 text-base font-medium'],
    ['muted', 'text-#777'],
    ['input', 'border border-#ece7e1 rounded px-3 py-2 bg-white text-#333 placeholder:text-#9aa0a6 focus:outline-none focus:ring-2 focus:ring-#e6eef5'],
    ['chip', 'px-2 py-0.5 rounded-full bg-#f3efe9 text-#666 text-xs'],
    ['chip-success', 'px-2 py-0.5 rounded-full bg-#e7f6ec text-#127a3e text-xs'],
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
