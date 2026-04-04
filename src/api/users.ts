import type {
  LevelResponse,
  StatsDiffResponse,
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

export function getUserStatsDiff(
  userId: string,
  category = "overall"
): Promise<StatsDiffResponse | undefined> {
  return apiGet<StatsDiffResponse | undefined>(
    `/users/${userId}/stats-diff?category=${encodeURIComponent(category)}`
  );
}
