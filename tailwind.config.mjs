/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0A0A0A',
        'bg-card': '#1A1A1A',
        'bg-border': '#2D2D2D',
        'gold-primary': '#C9A84C',
        'gold-light': '#E8D48B',
        'text-main': '#F5F5F5',
        'text-muted': '#A0A0A0',
        // Legacy support
        background: '#0A0A0A',
        primary: '#C9A84C',
        primaryHover: '#E8D48B',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};
