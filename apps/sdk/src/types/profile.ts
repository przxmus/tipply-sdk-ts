import type { ISODateString, JsonObject, UUID } from "./common";

export interface UserProfileAddress {
  city: string;
  street: string;
  postal_code: string;
  country: string;
}

export interface UserProfileAvatar {
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

export interface UserProfile {
  id: UUID;
  link: string;
  description: string;
  fullname: string;
  fullname_locked: boolean;
  personal_number?: string | null;
  address?: UserProfileAddress;
  bank_number?: string | null;
  bank_number_modification_date?: ISODateString | null;
  paypal_email?: string | null;
  google_avatar_url?: string | null;
  avatar?: UserProfileAvatar;
  theme_color?: string | null;
  hits: number;
  social_media_link?: string | null;
  is_company: boolean;
  contact_name?: string | null;
  contact_email?: string | null;
  replace_emotes: boolean;
  emotes_id?: string | null;
  emotes_init: boolean;
  social_media_links: JsonObject[];
  show_ranking_and_messages: boolean;
}

export interface UpdatePageSettingsRequest {
  description?: string;
  replaceEmotes?: boolean;
}

export interface PublicSocialMediaLink extends JsonObject {}
