/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_N8N_WEBHOOK: string;
  readonly PUBLIC_CALENDAR_URL: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_PREVIEW?: string;
  readonly PUBLIC_GSC_VERIFICATION?: string;
  readonly NOTION_TOKEN: string;
  readonly NOTION_PREVIEW?: string;
  readonly NOTION_MOCK?: string;
  readonly DS_SECCIONES_WEB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
