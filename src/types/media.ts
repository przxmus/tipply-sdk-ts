import type { ISODateString, JsonObject } from "./common";

export interface MediumRecord {
  provider_metadata: JsonObject;
  name: string;
  enabled: boolean;
  provider_name: string;
  provider_status: number;
  provider_reference: string;
  width: number;
  height: number;
  context: string;
  updated_at: ISODateString;
  created_at: ISODateString;
  content_type: string;
  size: number;
  id: number;
}

export interface MediaUsage {
  usage: number;
  total: number;
}

export interface MediumFormatProperties extends JsonObject {
  alt?: string;
  title?: string;
  src?: string;
  width?: number;
  height?: number;
  srcset?: string;
  sizes?: string;
}

export interface MediumFormatEntry {
  url: string;
  properties: MediumFormatProperties;
}

export type MediumFormats = Record<string, MediumFormatEntry>;
