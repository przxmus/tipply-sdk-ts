import type { ISODateString, UUID } from "./common";

export interface ModeratorRecord {
  user_id: UUID;
  moderation_mode: string;
  id: UUID;
  moderator_name: string;
  link_time: number;
  link: string;
  created: ISODateString;
}

export interface CreateModeratorRequest {
  moderator_name: string;
  link_time: number;
  link: string;
}
