import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const isPreviewBuild = process.env.PUBLIC_PREVIEW === 'true';

// https://astro.build/config
export default defineConfig({
  // Preview builds must not generate production sitemap URLs.
  ...(isPreviewBuild ? {} : { site: 'https://travelagentia.com/' }),
  integrations: [
    react(),
    tailwind(),
    ...(!isPreviewBuild
      ? [sitemap({
          filter: (page) =>
            ![
              '/cursos/',
              '/servicios/consultoria/',
              '/servicios/formacion/',
              '/servicios/llaves-en-mano/',
              '/servicios/ponencias/',
            ].some(path => page.includes(path)),
        })]
      : []),
  ],
  redirects: {
    '/servicios/consultoria': '/consultoria',
    '/servicios/formacion': '/formacion',
    '/cursos': '/formacion',
    '/servicios/llaves-en-mano': '/servicios',
    '/servicios/ponencias': '/prensa-y-ponente',
  },
});
