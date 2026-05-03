import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://travelagentia.com/',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) =>
        ![
          '/cursos/',
          '/servicios/consultoria/',
          '/servicios/formacion/',
          '/servicios/llaves-en-mano/',
          '/servicios/ponencias/',
        ].some(path => page.includes(path)),
    }),
  ],
  redirects: {
    '/servicios/consultoria': '/consultoria',
    '/servicios/formacion': '/formacion',
    '/cursos': '/formacion',
    '/servicios/llaves-en-mano': '/servicios',
    '/servicios/ponencias': '/prensa-y-ponente',
  },
});
