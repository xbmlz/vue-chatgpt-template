import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'bg-base': 'bg-white dark:bg-[#17171a]',
    'bg-base-100': 'bg-light-200/50 dark:bg-[#181818]',
    'bg-darker': 'bg-black/4 dark:bg-white/4',
    'border-base': 'border-[#e5e6eb] dark:border-[#333335]',
    'border-primary': 'b-primary dark:b-primary',
    'border-error': 'border border-red-700 dark:border-red-400/80',
    'text-error': 'text-red-700 dark:text-red-400/80',
    'fcc': 'flex justify-center items-center',
    'max-w-base': 'max-w-4xl mx-auto',
    'fc': 'flex items-center',
    'hv-base': 'transition-colors cursor-pointer hover:bg-darker',
    'hv-primary': 'transition-colors cursor-pointer hover:bg-primary/6',
    'hv-foreground': 'transition-opacity cursor-pointer op-70 hover:op-100',
    'btn-disabled': '!bg-[#e5e6eb] !dark:bg-[#333335] !text-[#8d8d91] !dark:text-[#8d8d91] cursor-not-allowed',
    'code-copy-btn': 'absolute z-3 op-90 w-8 h-8 p-1 top-12px right-12px bg-light-300 dark:bg-dark-300 hover-text-primary fcc border rounded-md b-transparent cursor-pointer',
  },
  theme: {
    colors: {
      primary: '#CE283C',
    },
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography({
      cssExtend: {
        '*:first-child': {
          'margin-top': 0,
        },
        '*:last-child': {
          'margin-bottom': 0,
        },
        'h1': {
          'font-size': '1.25em',
          'margin': '1rem 0',
        },
        'h2': {
          'font-size': '1.16em',
          'margin': '1rem 0',
        },
        'h3': {
          'font-size': '1.1em',
          'margin': '1rem 0',
        },
        'h4, h5, h6': {
          'font-size': '1em',
          'margin': '1rem 0',
        },
        ':not(pre) > code': {
          'font-weight': 400,
          'padding': '0 0.2em',
          'color': 'var(--prism-keyword)',
        },
        'pre': {
          'background-color': 'var(--prism-background) !important',
        },
      },
    }),
  ],
})
