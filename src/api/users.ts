import type {
  LevelResponse,
  UserAllStatisticsResponse,
  UserResponse,
} from "../types/api.js";
import { apiGet } from "./client.js";

export function getUser(userId: string): Promise<UserResponse> {
  return apiGet<UserResponse>(`/users/${userId}`);
}

export function getUserLevel(userId: string): Promise<LevelResponse> {
  return apiGet<LevelResponse>(`/users/${userId}/level`);
}

export function getUserAllStatistics(
  userId: string
): Promise<UserAllStatisticsResponse> {
  return apiGet<UserAllStatisticsResponse>(`/users/${userId}/statistics/all`);
}
