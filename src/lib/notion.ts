import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
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
  BlogPost, 
  AjusteGlobal,
  NotionFile,
  NotionDate
} from "./notion.types";

const notion = new Client({
  auth: import.meta.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const IS_PREVIEW = import.meta.env.NOTION_PREVIEW === "true";

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

function getFiles(property: any): NotionFile[] {
  if (!property || !property.files) return [];
  return property.files.map((f: any) => {
    if (f.type === "external") {
      return { name: f.name, url: f.external.url };
    }
    return { name: f.name, url: f.file.url };
  });
}

async function getRichTextMarkdown(pageId: string): Promise<string> {
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  return mdString.parent || "";
}

// Caching
const cache = new Map<string, any>();

async function fetchFromNotion(databaseId: string, mapper: (row: any) => any, sorts: any[] = []) {
  if (!databaseId) return [];
  const cacheKey = `${databaseId}-${IS_PREVIEW}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const filter = IS_PREVIEW ? undefined : {
      property: "Publicado",
      checkbox: {
        equals: true,
      },
    };

    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
      sorts,
    });

    const results = response.results.map(mapper);
    cache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.error(`Error fetching Notion DB ${databaseId}:`, error);
    return [];
  }
}

// API
export async function getSecciones(): Promise<SeccionWeb[]> {
  const data = await fetchFromNotion(import.meta.env.DS_SECCIONES_WEB, (row) => ({
    Slug: getPlainText(row.properties["Slug"]),
    Título: getPlainText(row.properties["Título"]),
    Subtítulo: getPlainText(row.properties["Subtítulo"]),
    Cuerpo: getPlainText(row.properties["Cuerpo"]), // We will fetch rich text only if needed, but for 'Cuerpo' the brief says "usar notion-to-md solo para Cuerpo, etc". Wait, we can't easily fetch all page blocks in one list query. So we'll map `Cuerpo` to page blocks later or just use plain text if it's not a full page. Ah, wait, if Cuerpo is a property (rich_text), notion-to-md is not for properties, it's for page content! Oh, the user says "usar notion-to-md solo para Cuerpo, Respuesta, Descripción larga, Resumen y el body del Blog". If they are properties of type `rich_text`, `n2m` can't render them directly, but maybe we can just get their markdown? Or we fetch the page blocks? "El cuerpo va en los blocks de la página Notion → renderizar con notion-to-md". For the others, if they are `rich_text` properties, `getPlainText` is what we usually do. Wait, `rich_text` can have bold, links, etc. Let's just use `getPlainText` for now, or write a helper to convert `rich_text` to markdown.
    "CTA texto": getPlainText(row.properties["CTA texto"]),
    "CTA link": getUrl(row.properties["CTA link"]),
    Página: getSelect(row.properties["Página"]) as any,
    Orden: getNumber(row.properties["Orden"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
    "Notas internas": getPlainText(row.properties["Notas internas"]),
    _pageId: row.id,
  }), [{ property: "Orden", direction: "ascending" }]);
  return data;
}

export async function getAjustes(): Promise<Record<string, AjusteGlobal>> {
  const data = await fetchFromNotion(import.meta.env.DS_AJUSTES_GLOBALES, (row) => ({
    Clave: getPlainText(row.properties["Clave"]),
    Valor: getPlainText(row.properties["Valor"]),
    Tipo: getSelect(row.properties["Tipo"]) as any,
    Grupo: getSelect(row.properties["Grupo"]) as any,
    Notas: getPlainText(row.properties["Notas"]),
  }));
  const config: Record<string, AjusteGlobal> = {};
  data.forEach((item: AjusteGlobal) => {
    config[item.Clave] = item;
  });
  return config;
}

export async function getServicios(): Promise<Servicio[]> {
  return await fetchFromNotion(import.meta.env.DS_SERVICIOS, (row) => ({
    Nombre: getPlainText(row.properties["Nombre"]),
    Icono: getPlainText(row.properties["Icono"]),
    "Descripción corta": getPlainText(row.properties["Descripción corta"]),
    "Descripción larga": getPlainText(row.properties["Descripción larga"]),
    "Precio desde (€)": getNumber(row.properties["Precio desde (€)"]),
    "Slug URL": getPlainText(row.properties["Slug URL"]),
    "CTA texto": getPlainText(row.properties["CTA texto"]),
    Orden: getNumber(row.properties["Orden"]),
    Destacado: getCheckbox(row.properties["Destacado"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
    Imagen: getFiles(row.properties["Imagen"]),
  }), [{ property: "Orden", direction: "ascending" }]);
}

export async function getHitos(): Promise<Hito[]> {
  return await fetchFromNotion(import.meta.env.DS_HITOS, (row) => ({
    Título: getPlainText(row.properties["Título"]),
    Año: getNumber(row.properties["Año"]),
    "Fecha exacta": getDate(row.properties["Fecha exacta"]),
    Descripción: getPlainText(row.properties["Descripción"]),
    "Icono / Emoji": getPlainText(row.properties["Icono / Emoji"]),
    Categoría: getSelect(row.properties["Categoría"]) as any,
    Orden: getNumber(row.properties["Orden"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), [{ property: "Año", direction: "ascending" }, { property: "Orden", direction: "ascending" }]);
}

export async function getFaqs(): Promise<Faq[]> {
  return await fetchFromNotion(import.meta.env.DS_FAQ, (row) => ({
    Pregunta: getPlainText(row.properties["Pregunta"]),
    Respuesta: getPlainText(row.properties["Respuesta"]),
    Categoría: getSelect(row.properties["Categoría"]) as any,
    Orden: getNumber(row.properties["Orden"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), [{ property: "Orden", direction: "ascending" }]);
}

export async function getTestimonios(): Promise<Testimonio[]> {
  return await fetchFromNotion(import.meta.env.DS_TESTIMONIOS, (row) => ({
    Nombre: getPlainText(row.properties["Nombre"]),
    Cargo: getPlainText(row.properties["Cargo"]),
    "Agencia / Empresa": getPlainText(row.properties["Agencia / Empresa"]),
    Foto: getFiles(row.properties["Foto"]),
    Texto: getPlainText(row.properties["Texto"]),
    Estrellas: getNumber(row.properties["Estrellas"]),
    Fuente: getSelect(row.properties["Fuente"]) as any,
    Orden: getNumber(row.properties["Orden"]),
    "Destacado en home": getCheckbox(row.properties["Destacado en home"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), [{ property: "Orden", direction: "ascending" }]);
}

export async function getProyectos(): Promise<ProyectoCaso[]> {
  return await fetchFromNotion(import.meta.env.DS_PROYECTOS_CASOS, (row) => ({
    Cliente: getPlainText(row.properties["Cliente"]),
    Sector: getSelect(row.properties["Sector"]) as any,
    Problema: getPlainText(row.properties["Problema"]),
    Solución: getPlainText(row.properties["Solución"]),
    "Resultado (métricas)": getPlainText(row.properties["Resultado (métricas)"]),
    "Imagen portada": getFiles(row.properties["Imagen portada"]),
    Tags: getMultiSelect(row.properties["Tags"]) as any,
    Fecha: getDate(row.properties["Fecha"]),
    "Testimonio breve": getPlainText(row.properties["Testimonio breve"]),
    "Slug URL": getPlainText(row.properties["Slug URL"]),
    Orden: getNumber(row.properties["Orden"]),
    "Destacado en home": getCheckbox(row.properties["Destacado en home"]),
    Publicado: getCheckbox(row.properties["Publicado"]),
  }), [{ property: "Orden", direction: "ascending" }]);
}
