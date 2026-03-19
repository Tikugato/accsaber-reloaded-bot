export interface DiscordLinkResponse {
  discordId: string;
  userId: string;
  playerName: string;
  createdAt: string;
}

export interface LevelResponse {
  level: number;
  title: string;
  totalXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export interface LevelThreshold {
  level: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}
