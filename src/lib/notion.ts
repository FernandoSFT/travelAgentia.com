import { Client } from "@notionhq/client";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { 
  SeccionWeb, 
  Servicio, 
  ProyectoCaso, 
  Charla, 
  Curso, 
  Podcast, 
  Testimonio, 
  Faq, 
  Hito, 
  AjusteGlobal,
  NotionFile,
  NotionDate
} from "./notion.types";

import * as mocks from "./notion.mock";

import { loadEnv } from "vite";

const envCache = loadEnv("production", process.cwd(), "");
const getEnv = (key: string): string => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return envCache[key] || (import.meta as any).env?.[key];
};

const IS_MOCK = getEnv("NOTION_MOCK") === "true" || !getEnv("NOTION_TOKEN") || getEnv("NOTION_TOKEN").includes("dummy");
const IS_PREVIEW = getEnv("NOTION_PREVIEW") === "true";

const notion = IS_MOCK ? null : new Client({ auth: getEnv("NOTION_TOKEN") });

// Asset downloader
async function downloadNotionFile(url: string, filename: string): Promise<string> {
  if (IS_MOCK || !url.startsWith("http")) return url;
  
  try {
    const ext = url.split("?")[0].split(".").pop() || "png";
    const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
    const safeFilename = `${hash}-${filename.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`;
    
    // We will save to public/notion-assets/ so it's accessible directly and by astro:assets
    const dir = path.join(process.cwd(), "public", "notion-assets");
    await fs.mkdir(dir, { recursive: true });
    
    const filePath = path.join(dir, safeFilename);
    const publicPath = `/notion-assets/${safeFilename}`;
    
    // Only download if doesn't exist
    try {
      await fs.access(filePath);
      return publicPath;
    } catch {
      // File doesn't exist, proceed to download
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    
    return publicPath;
  } catch (error) {
    console.warn(`[notion] warn: Failed to download asset ${filename}`, error);
    return url; // fallback to original
  }
}

// Helpers
function getPlainText(property: any): string {
  if (!property) return "";
  if (property.type === "title") return property.title.map((t: any) => t.plain_text).join("");
  if (property.type === "rich_text") return property.rich_text.map((t: any) => t.plain_text).join("");
  return "";
}

function getSelect(property: any): string {
  return property?.select?.name || "";
}

function getMultiSelect(property: any): string[] {
  return property?.multi_select?.map((s: any) => s.name) || [];
}

function getCheckbox(property: any): boolean {
  return property?.checkbox || false;
}

function getNumber(property: any): number {
  return property?.number || 0;
}

function getUrl(property: any): string {
  return property?.url || "";
}

function getDate(property: any): NotionDate {
  return property?.date || { start: "", end: null, time_zone: null };
}

async function getFiles(property: any): Promise<NotionFile[]> {
  if (!property || !property.files) return [];
  const files: NotionFile[] = [];
  
  for (const f of property.files) {
    const name = f.name;
    const url = f.type === "external" ? f.external.url : f.file.url;
    // Download internal Notion files because they expire
    const finalUrl = f.type === "file" ? await downloadNotionFile(url, name) : url;
    files.push({ name, url: finalUrl });
  }
  return files;
}

async function getRichTextMarkdown(property: any): Promise<string> {
  // We use n2m mainly for page blocks, but the user requested notion-to-md for long text fields.
  // Actually, notion-to-md converts block objects, not property rich_text directly, but we can do a naive conversion
  // or fetch the blocks if it's the main page body.
  // We will assume "Cuerpo", "Descripción larga" are just rich text fields in the DB.
  // We will convert rich text manually to markdown since n2m is for blocks.
  if (!property || property.type !== "rich_text") return "";
  let md = "";
  for (const rt of property.rich_text) {
    let text = rt.plain_text;
    if (rt.annotations.bold) text = `**${text}**`;
    if (rt.annotations.italic) text = `*${text}*`;
    if (rt.annotations.strikethrough) text = `~~${text}~~`;
    if (rt.annotations.code) text = `\`${text}\``;
    if (rt.href) text = `[${text}](${rt.href})`;
    md += text;
  }
  return md;
}

// Caching
const cache = new Map<string, any>();

async function fetchFromNotion(databaseId: string | undefined, mapper: (row: any) => Promise<any>, mockData: any[], sorts: any[] = [], options?: { skipFilter?: boolean }) {
  if (IS_MOCK || !databaseId) {
    console.warn(`[notion] ⚠ Using mock data (IS_MOCK=${IS_MOCK}, dbId=${databaseId || 'undefined'})`);
    return mockData;
  }
  
  const cacheKey = `${databaseId}-${IS_PREVIEW}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const filter = (IS_PREVIEW || options?.skipFilter) ? undefined : {
      property: "Publicado",
      checkbox: { equals: true },
    };

    if (sorts.length === 0) {
      sorts = [{ timestamp: "created_time", direction: "descending" }];
    }

    console.log(`[notion] Querying data source ${databaseId}...`);

    const response = await notion!.dataSources.query({
      data_source_id: databaseId,
      filter,
      sorts,
    });

    const results = [];
    for (const row of response.results) {
      results.push(await mapper(row));
    }
    
    console.log(`[notion] ✓ Fetched ${results.length} items from ${databaseId}`);
    cache.set(cacheKey, results);
    return results;
  } catch (error: any) {
    const code = error?.code || 'unknown';
    const msg = error?.message?.slice(0, 200) || 'No message';
    console.error(`[notion] ✗ Error fetching DS ${databaseId}: [${code}] ${msg}`);
    return mockData;
  }
}

// API
export async function getSecciones(): Promise<SeccionWeb[]> {
  return await fetchFromNotion(getEnv("DS_SECCIONES_WEB"), async (row) => ({
    Slug: getPlainText(row.properties["Slug"]),
    Título: getPlainText(row.properties["Título"]),
    Subtítulo: getPlainText(row.properties["Subtítulo"]),
    Cuerpo: await getRichTextMarkdown(row.properties["Cuerpo"]), 
    "CTA texto": getPlainText(row.properties["CTA texto"]),
    "CTA link": getUrl(row.properties["CTA link"]),
    Página: getSelect(row.properties["Página"]) as any,
    Orden: getNumber(row.properties["Orden"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
    "Notas internas": getPlainText(row.properties["Notas internas"]),
  }), mocks.mockSecciones, [{ property: "Orden", direction: "ascending" }]);
}

export async function getAjustes(): Promise<Record<string, AjusteGlobal>> {
  const data = await fetchFromNotion(getEnv("DS_AJUSTES_GLOBALES"), async (row) => ({
    Clave: getPlainText(row.properties["Clave"]),
    Valor: getPlainText(row.properties["Valor"]),
    Tipo: getSelect(row.properties["Tipo"]) as any,
    Grupo: getSelect(row.properties["Grupo"]) as any,
    Notas: getPlainText(row.properties["Notas"]),
  }), mocks.mockAjustes, [], { skipFilter: true });
  
  const config: Record<string, AjusteGlobal> = {};
  data.forEach((item: AjusteGlobal) => {
    config[item.Clave] = item;
  });
  return config;
}

export async function getServicios(): Promise<Servicio[]> {
  return await fetchFromNotion(getEnv("DS_SERVICIOS"), async (row) => ({
    Nombre: getPlainText(row.properties["Nombre"]),
    Icono: getPlainText(row.properties["Icono"]),
    "Descripción corta": getPlainText(row.properties["Descripción corta"]),
    "Descripción larga": await getRichTextMarkdown(row.properties["Descripción larga"]),
    "Precio desde (€)": getNumber(row.properties["Precio desde (€)"]),
    "Slug URL": getPlainText(row.properties["Slug URL"]),
    "CTA texto": getPlainText(row.properties["CTA texto"]),
    Orden: getNumber(row.properties["Orden"]),
    Destacado: getCheckbox(row.properties["Destacado"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
    Imagen: await getFiles(row.properties["Imagen"]),
  }), mocks.mockServicios, [{ property: "Orden", direction: "ascending" }]);
}

export async function getHitos(): Promise<Hito[]> {
  return await fetchFromNotion(getEnv("DS_HITOS"), async (row) => ({
    Título: getPlainText(row.properties["Título"]),
    Año: getNumber(row.properties["Año"]),
    "Fecha exacta": getDate(row.properties["Fecha exacta"]),
    Descripción: getPlainText(row.properties["Descripción"]),
    "Icono / Emoji": getPlainText(row.properties["Icono / Emoji"]),
    Categoría: getSelect(row.properties["Categoría"]) as any,
    Orden: getNumber(row.properties["Orden"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), mocks.mockHitos, [{ property: "Año", direction: "ascending" }, { property: "Orden", direction: "ascending" }]);
}

export async function getFaqs(): Promise<Faq[]> {
  return await fetchFromNotion(getEnv("DS_FAQ"), async (row) => ({
    Pregunta: getPlainText(row.properties["Pregunta"]),
    Respuesta: await getRichTextMarkdown(row.properties["Respuesta"]),
    Categoría: getSelect(row.properties["Categoría"]) as any,
    Orden: getNumber(row.properties["Orden"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), mocks.mockFaqs, [{ property: "Orden", direction: "ascending" }]);
}

export async function getTestimonios(): Promise<Testimonio[]> {
  return await fetchFromNotion(getEnv("DS_TESTIMONIOS"), async (row) => ({
    Nombre: getPlainText(row.properties["Nombre"]),
    Cargo: getPlainText(row.properties["Cargo"]),
    "Agencia / Empresa": getPlainText(row.properties["Agencia / Empresa"]),
    Foto: await getFiles(row.properties["Foto"]),
    Texto: getPlainText(row.properties["Texto"]),
    Estrellas: getNumber(row.properties["Estrellas"]),
    Fuente: getSelect(row.properties["Fuente"]) as any,
    Orden: getNumber(row.properties["Orden"]),
    "Destacado en home": getCheckbox(row.properties["Destacado en home"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), mocks.mockTestimonios, [{ property: "Orden", direction: "ascending" }]);
}

export async function getProyectos(): Promise<ProyectoCaso[]> {
  return await fetchFromNotion(getEnv("DS_PROYECTOS_CASOS"), async (row) => ({
    Cliente: getPlainText(row.properties["Cliente"]),
    Sector: getSelect(row.properties["Sector"]) as any,
    Problema: getPlainText(row.properties["Problema"]),
    Solución: getPlainText(row.properties["Solución"]),
    "Resultado (métricas)": getPlainText(row.properties["Resultado (métricas)"]),
    "Imagen portada": await getFiles(row.properties["Imagen portada"]),
    Tags: getMultiSelect(row.properties["Tags"]) as any,
    Fecha: getDate(row.properties["Fecha"]),
    "Testimonio breve": getPlainText(row.properties["Testimonio breve"]),
    "Slug URL": getPlainText(row.properties["Slug URL"]),
    Orden: getNumber(row.properties["Orden"]),
    "Destacado en home": getCheckbox(row.properties["Destacado en home"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), mocks.mockProyectos, [{ property: "Orden", direction: "ascending" }]);
}

export async function getCharlas(): Promise<Charla[]> {
  return await fetchFromNotion(getEnv("DS_CHARLAS"), async (row) => ({
    Título: getPlainText(row.properties["Título"]),
    Evento: getPlainText(row.properties["Evento"]),
    Fecha: getDate(row.properties["Fecha"]),
    Lugar: getPlainText(row.properties["Lugar"]),
    Resumen: await getRichTextMarkdown(row.properties["Resumen"]),
    "Vídeo URL": getUrl(row.properties["Vídeo URL"]),
    Foto: await getFiles(row.properties["Foto"]),
    "Slides URL": getUrl(row.properties["Slides URL"]),
    Orden: getNumber(row.properties["Orden"]),
    Destacada: getCheckbox(row.properties["Destacada"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), mocks.mockCharlas, [{ property: "Orden", direction: "ascending" }]);
}

export async function getCursos(): Promise<Curso[]> {
  return await fetchFromNotion(getEnv("DS_CURSOS"), async (row) => ({
    Nombre: getPlainText(row.properties["Nombre"]),
    Formato: getSelect(row.properties["Formato"]) as any,
    Horas: getNumber(row.properties["Horas"]),
    Fecha: getDate(row.properties["Fecha"]),
    "Precio (€)": getNumber(row.properties["Precio (€)"]),
    Estado: getSelect(row.properties["Estado"]) as any,
    Resumen: await getRichTextMarkdown(row.properties["Resumen"]),
    "URL inscripción": getUrl(row.properties["URL inscripción"]),
    Orden: getNumber(row.properties["Orden"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), mocks.mockCursos, [{ property: "Orden", direction: "ascending" }]);
}

export async function getPodcasts(): Promise<Podcast[]> {
  return await fetchFromNotion(getEnv("DS_PODCASTS"), async (row) => ({
    Título: getPlainText(row.properties["Título"]),
    Programa: getPlainText(row.properties["Programa"]),
    Fecha: getDate(row.properties["Fecha"]),
    Enlace: getUrl(row.properties["Enlace"]),
    Plataforma: getSelect(row.properties["Plataforma"]) as any,
    Resumen: await getRichTextMarkdown(row.properties["Resumen"]),
    Portada: await getFiles(row.properties["Portada"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), mocks.mockPodcasts, [{ property: "Fecha", direction: "descending" }]);
}

export async function getBlog(): Promise<any[]> {
  return await fetchFromNotion(getEnv("DS_BLOG"), async (row) => ({
    Título: getPlainText(row.properties["Título"]),
    Slug: getPlainText(row.properties["Slug"]),
    Fecha: getDate(row.properties["Fecha publicación"]),
    Resumen: getPlainText(row.properties["Resumen (meta description)"]),
    Cuerpo: "",  // Blog body content would come from page blocks, not a property
    Categoría: getSelect(row.properties["Tipo"]),
    Tags: getMultiSelect(row.properties["Tags"]),
    Imagen: await getFiles(row.properties["Portada"]),
    Destacado: getCheckbox(row.properties["Destacado"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), [], [{ property: "Fecha publicación", direction: "descending" }]);
}
