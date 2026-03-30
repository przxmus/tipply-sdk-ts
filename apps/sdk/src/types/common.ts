export type MaybePromise<T> = T | Promise<T>;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue | undefined;
}

export type ISODateString = string;

export type UUID = string;

export type MinorUnitAmount = number;

export type LiteralUnion<T extends string> = T | (string & {});
