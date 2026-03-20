import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Config } from "./types/config.js";

const configPath = resolve(process.cwd(), "config.json");

function loadConfig(): Config {
  let raw: string;

  if (process.env.CONFIG_JSON) {
    raw = process.env.CONFIG_JSON;
  } else if (existsSync(configPath)) {
    raw = readFileSync(configPath, "utf-8");
  } else {
    throw new Error("No config found. Set CONFIG_JSON env var or provide config.json");
  }

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
