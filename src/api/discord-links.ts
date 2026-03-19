import type { DiscordLinkResponse } from "../types/api.js";
import { apiGet, apiPost } from "./client.js";

export function getDiscordLink(
  discordId: string
): Promise<DiscordLinkResponse> {
  return apiGet<DiscordLinkResponse>(`/discord/links/${discordId}`);
}

export function getDiscordLinkByUser(
  userId: string
): Promise<DiscordLinkResponse> {
  return apiGet<DiscordLinkResponse>(`/discord/links/user/${userId}`);
}

export function createDiscordLink(
  discordId: string,
  profileUrl: string
): Promise<DiscordLinkResponse> {
  return apiPost<DiscordLinkResponse>("/discord/links", {
    discordId,
    profileUrl,
  });
}
