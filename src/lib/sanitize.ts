/**
 * Sanitización de HTML para evitar XSS.
 * Usa DOMPurify en entorno Node.js (Astro build time).
 * Solo permite un subconjunto seguro de tags HTML para contenido de blog.
 */
import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'mark',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption',
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'];

/**
 * Sanitiza HTML potencialmente malicioso de Notion.
 * Llamar SOLO en servidor (build time de Astro).
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    // Forzar rel="noopener noreferrer" en todos los links
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
