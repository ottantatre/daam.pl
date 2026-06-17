import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n";
import type { UtilSlug } from "@/lib/utils-tools";
import { Base64 } from "./Base64";
import { Case } from "./Case";
import { Color } from "./Color";
import { Hash } from "./Hash";
import { Json } from "./Json";
import { Jwt } from "./Jwt";
import { Lorem } from "./Lorem";
import { PasswordGenerator } from "./PasswordGenerator";
import { TextStats } from "./TextStats";
import { Timestamp } from "./Timestamp";
import { UrlEncode } from "./UrlEncode";
import { Uuid } from "./Uuid";

export const toolComponents: Record<UtilSlug, ComponentType<{ locale: Locale }>> = {
  "password-generator": PasswordGenerator,
  uuid: Uuid,
  hash: Hash,
  base64: Base64,
  "url-encode": UrlEncode,
  json: Json,
  jwt: Jwt,
  color: Color,
  timestamp: Timestamp,
  case: Case,
  "text-stats": TextStats,
  lorem: Lorem,
};
