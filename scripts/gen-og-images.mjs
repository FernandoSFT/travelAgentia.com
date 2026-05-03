/**
 * Generador de OG Images para TravelAgentIA.
 * Usa Sharp para renderizar SVGs a PNG 1200x630 optimizados.
 * Se ejecuta en build time (Astro).
 */
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/images/og');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Colores de marca
const GOLD = '#C9A84C';
const DARK = '#0A0A0A';
const MID = '#1a1a1a';
const TEXT = '#E5E5E5';
const MUTED = '#888888';

// ──────────────────────────────────────────────
// SVG TEMPLATES
// ──────────────────────────────────────────────

function baseSvg({ title, subtitle, badge, darkBg = true }) {
  const bg = darkBg ? DARK : '#111111';
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad)"/>

  <!-- Subtle grid pattern -->
  <g opacity="0.03">
    ${Array.from({ length: 20 }, (_, i) =>
      `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="630" stroke="${GOLD}" stroke-width="1"/>`
    ).join('')}
    ${Array.from({ length: 10 }, (_, i) =>
      `<line x1="0" y1="${i * 70}" x2="1200" y2="${i * 70}" stroke="${GOLD}" stroke-width="1"/>`
    ).join('')}
  </g>

  <!-- Gold accent line -->
  <rect x="100" y="480" width="1000" height="1" fill="url(#goldLine)"/>

  <!-- Gold badge -->
  ${badge ? `
  <rect x="100" y="100" width="${badge.length * 12 + 40}" height="36" rx="18" fill="${GOLD}" fill-opacity="0.1" stroke="${GOLD}" stroke-width="1"/>
  <text x="120" y="125" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${GOLD}" letter-spacing="3">${badge}</text>
  ` : ''}

  <!-- Title -->
  <text x="100" y="${badge ? 210 : 180}" font-family="Georgia, 'Times New Roman', serif" font-size="72" font-weight="700" fill="#FFFFFF">${escapeXml(title)}</text>

  <!-- Subtitle -->
  ${subtitle ? `
  <text x="100" y="${badge ? 290 : 260}" font-family="system-ui, sans-serif" font-size="28" fill="${MUTED}" letter-spacing="1">${escapeXml(subtitle)}</text>
  ` : ''}

  <!-- Footer brand -->
  <text x="100" y="560" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="${GOLD}">TravelAgentIA</text>
  <text x="100" y="595" font-family="system-ui, sans-serif" font-size="16" fill="${MUTED}">travelagentia.com</text>

  <!-- Decorative corner -->
  <path d="M1100 0 L1200 0 L1200 100 Z" fill="${GOLD}" fill-opacity="0.05"/>
  <path d="M0 530 L0 630 L100 630 Z" fill="${GOLD}" fill-opacity="0.05"/>
</svg>`;
}

function serviciosSvg() {
  return baseSvg({
    badge: 'SERVICIOS',
    title: 'IA para agencias\nde viajes',
    subtitle: 'Formación · Consultoría · Implementación',
  });
}

function consultoriaSvg() {
  return baseSvg({
    badge: 'CONSULTORÍA',
    title: 'Yo hago\nel trabajo.',
    subtitle: '150€/hora · Videoconferencia · De agente a agente',
  });
}

function formacionSvg() {
  return baseSvg({
    badge: 'FORMACIÓN',
    title: 'Que tu equipo sepa\nlo que tú ya sabes.',
    subtitle: '60€/hora · Por videoconferencia · Sesiones a medida',
  });
}

function comunidadSvg() {
  return baseSvg({
    badge: 'COMUNIDAD',
    title: 'Aprende IA\na tu ritmo.',
    subtitle: 'Sesiones grupales · Biblioteca de prompts · Soporte entre colegas',
  });
}

function blogSvg({ title }) {
  return baseSvg({
    badge: 'BLOG',
    title: title.length > 30 ? title.substring(0, 30) + '…' : title,
    subtitle: 'IA aplicada al sector turístico',
  });
}

function sobreMiSvg() {
  return baseSvg({
    badge: 'SOBRE MÍ',
    title: 'Fernando Córdoba',
    subtitle: 'Agente de viajes y Consultor de IA · SAFE TOUR',
  });
}

function homeSvg() {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#grad)"/>

  <!-- Grid -->
  <g opacity="0.03">
    ${Array.from({ length: 20 }, (_, i) =>
      `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="630" stroke="${GOLD}" stroke-width="1"/>`
    ).join('')}
  </g>

  <!-- Big title -->
  <text x="100" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-weight="700" fill="#FFFFFF">TravelAgentIA</text>

  <!-- Gold divider -->
  <rect x="100" y="280" width="200" height="3" fill="${GOLD}"/>

  <!-- Subtitle -->
  <text x="100" y="340" font-family="system-ui, sans-serif" font-size="32" fill="${MUTED}" letter-spacing="1">IA para agencias de viajes</text>

  <!-- Services row -->
  <text x="100" y="420" font-family="system-ui, sans-serif" font-size="22" fill="${TEXT}">Formación · Consultoría · Automatización</text>

  <!-- Gold bottom bar -->
  <rect x="0" y="600" width="1200" height="30" fill="${GOLD}" fill-opacity="0.08"/>
  <text x="100" y="625" font-family="system-ui, sans-serif" font-size="16" fill="${MUTED}">travelagentia.com</text>

  <!-- Decorative -->
  <path d="M1050 0 L1200 0 L1200 150 Z" fill="${GOLD}" fill-opacity="0.05"/>
</svg>`;
}

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function svgToPng(svgString, outputPath) {
  const svgBuffer = Buffer.from(svgString);
  await sharp(svgBuffer, { density: 150 })
    .resize(1200, 630)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(outputPath);
  console.log(`✓ ${outputPath}`);
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────

const GENERATORS = {
  'og-servicios.png': serviciosSvg,
  'og-consultoria.png': consultoriaSvg,
  'og-formacion.png': formacionSvg,
  'og-comunidad.png': comunidadSvg,
  'og-home.png': homeSvg,
  'og-sobre-mi.png': sobreMiSvg,
};

async function main() {
  console.log('🎨 Generando OG Images...\n');

  // Home page
  await svgToPng(homeSvg(), join(OUT_DIR, 'og-home.png'));

  // Static pages
  await svgToPng(serviciosSvg(), join(OUT_DIR, 'og-servicios.png'));
  await svgToPng(consultoriaSvg(), join(OUT_DIR, 'og-consultoria.png'));
  await svgToPng(formacionSvg(), join(OUT_DIR, 'og-formacion.png'));
  await svgToPng(comunidadSvg(), join(OUT_DIR, 'og-comunidad.png'));
  await svgToPng(sobreMiSvg(), join(OUT_DIR, 'og-sobre-mi.png'));

  console.log('\n✅ OG Images generadas en public/images/og/');
}

main().catch(console.error);
