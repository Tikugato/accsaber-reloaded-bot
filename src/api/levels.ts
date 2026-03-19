import { config } from "../config.js";
import type { LevelThreshold } from "../types/api.js";
import { TTLCache } from "./cache.js";
import { apiGet } from "./client.js";

const cache = new TTLCache<LevelThreshold[]>(config.api.cacheTtlMs);

export async function getLevelThresholds(): Promise<LevelThreshold[]> {
  const cached = cache.get();
  if (cached) return cached;

  const thresholds = await apiGet<LevelThreshold[]>("/levels");
  cache.set(thresholds);
  return thresholds;
}
