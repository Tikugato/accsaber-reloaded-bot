import type { LevelResponse } from "../types/api.js";
import { apiGet } from "./client.js";

export function getUserLevel(userId: string): Promise<LevelResponse> {
  return apiGet<LevelResponse>(`/users/${userId}/level`);
}
