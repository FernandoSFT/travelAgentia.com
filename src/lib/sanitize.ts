/**
 * Sanitización y conversión de contenido.
 * Usa DOMPurify en entorno Node.js (Astro build time).
 * Soporta tanto HTML como Markdown (blog posts de Notion via notion-to-md).
 */
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'mark',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption',
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'];

// Configurar marked para enlaces seguros
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Convierte Markdown a HTML seguro y sanitizado.
 * Para contenido de blog (Notion via notion-to-md).
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  let html: string;

  // Si parece Markdown (contiene **, ##, -, `), convertir primero
  if (dirty.match(/[*_#`>\-\[\]]/)) {
    try {
      html = marked.parse(dirty) as string;
    } catch {
      html = dirty;
    }
  } else {
    html = dirty;
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORCE_BODY: false,
  });
}

/**
 * Versión estricta: elimina TODO el HTML y devuelve texto plano.
 * Para campos que no deberían tener HTML nunca (nombres, títulos, etc.)
 */
export function stripAllHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
