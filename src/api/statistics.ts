import type {
  LeaderboardEntry,
  Page,
  StatsDiffResponse,
  UserCategoryStatisticsResponse,
} from "../types/api.js";
import { apiGet } from "./client.js";

export function getUserCategoryStatistics(
  userId: string,
  categoryCode: string
): Promise<UserCategoryStatisticsResponse> {
  return apiGet<UserCategoryStatisticsResponse>(
    `/users/${userId}/statistics?category=${encodeURIComponent(categoryCode)}`
  );
}

export async function getCategoryLeaderboardAt(
  categoryId: string,
  rank: number
): Promise<LeaderboardEntry | undefined> {
  const page = Math.max(0, rank - 1);
  const result = await apiGet<Page<LeaderboardEntry>>(
    `/leaderboards/${categoryId}?page=${page}&size=1&sort=ranking,asc`
  );
  return result.content.find((e) => e.ranking === rank);
}

export function getUserStatsDiff(
  userId: string,
  categoryCode: string
): Promise<StatsDiffResponse | undefined> {
  return apiGet<StatsDiffResponse | undefined>(
    `/users/${userId}/stats-diff?category=${encodeURIComponent(categoryCode)}`
  );
}
