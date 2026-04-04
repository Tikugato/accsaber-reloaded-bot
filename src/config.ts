import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Config } from "./types/config.js";

const configPath = resolve(process.cwd(), "config.json");

function loadConfig(): Config {
  const raw = readFileSync(configPath, "utf-8");
  const parsed = JSON.parse(raw) as Config;

  const required: string[] = [];
  if (!parsed.clientId) required.push("clientId");
  if (!parsed.guildId) required.push("guildId");
  if (!parsed.api?.baseUrl) required.push("api.baseUrl");
  if (!parsed.roles?.levelTiers) required.push("roles.levelTiers");

  if (required.length > 0) {
    throw new Error(`Missing required config fields: ${required.join(", ")}`);
  }

  return parsed;
}

export const config = loadConfig();
