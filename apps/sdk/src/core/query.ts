import type { RequestQuery } from "./types";

function appendQueryValue(searchParams: URLSearchParams, key: string, value: string | number | boolean): void {
  searchParams.append(key, String(value));
}

/** Serializes a request query object into a URL query string. */
export function serializeQuery(query?: RequestQuery): string {
  if (!query) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null) {
      continue;
    }

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        if (item === undefined || item === null) {
          continue;
        }

        appendQueryValue(searchParams, key, item);
      }

      continue;
    }

    appendQueryValue(searchParams, key, rawValue as string | number | boolean);
  }

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}
