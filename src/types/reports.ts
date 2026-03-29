import type { ISODateString } from "./common";

export interface ReportRecord {
  is_downloadable: boolean;
  report_number: string;
  generated_at: ISODateString;
  id: string;
}
