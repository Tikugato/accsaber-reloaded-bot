import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { getCategories } from "../api/categories.js";
import { ApiError } from "../api/client.js";
import { getUserScores } from "../api/scores.js";
import {
  getUser,
  getUserAllStatistics,
  getUserLevel,
  getUserStatsDiff,
} from "../api/users.js";
import type { Command } from "../client.js";
import { renderProfileCard } from "../utils/card-renderer.js";
import { errorEmbed } from "../utils/embeds.js";

const get: Command = {
  data: new SlashCommandBuilder()
    .setName("get")
    .setDescription("Show a player's AccSaber profile card")
    .addStringOption((option) =>
      option
        .setName("steam-id")
        .setDescription("The player's Steam ID")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Stats category to display (default: Overall)")
        .setRequired(false)
        .addChoices(
          { name: "Overall", value: "overall" },
          { name: "True Acc", value: "true_acc" },
          { name: "Standard Acc", value: "standard_acc" },
          { name: "Tech Acc", value: "tech_acc" },
          { name: "Low Mid", value: "low_mid" }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const steamId = interaction.options.getString("steam-id", true);
    const categoryCode =
      interaction.options.getString("category") ?? "overall";

    const [userResult, levelResult, allStatsResult, diffResult, scoresResult] =
      await Promise.allSettled([
        getUser(steamId),
        getUserLevel(steamId),
        getUserAllStatistics(steamId),
        getUserStatsDiff(steamId, categoryCode),
        getUserScores(steamId, { size: 3, sort: "weightedAp,desc" }),
      ]);

    if (userResult.status === "rejected") {
      if (
        userResult.reason instanceof ApiError &&
        userResult.reason.status === 404
      ) {
        await interaction.editReply({
          embeds: [
            errorEmbed(
              "Player Not Found",
              `No AccSaber profile found for \`${steamId}\`.`
            ),
          ],
        });
        return;
      }
      throw userResult.reason;
    }

    const user = userResult.value;

    if (user.banned) {
      await interaction.editReply({
        embeds: [errorEmbed("Player Banned", `**${user.name}** is banned.`)],
      });
      return;
    }

    const level =
      levelResult.status === "fulfilled" ? levelResult.value : undefined;
    const allStats =
      allStatsResult.status === "fulfilled" ? allStatsResult.value : undefined;
    const diff =
      diffResult.status === "fulfilled" ? diffResult.value : undefined;
    const scores =
      scoresResult.status === "fulfilled" ? scoresResult.value : undefined;

    const categories = await getCategories();
    const categoryIdToCode: Record<string, string> = {};
    for (const cat of categories) {
      categoryIdToCode[cat.id] = cat.code;
    }

    const targetCat = categories.find((c) => c.code === categoryCode);
    const categoryStats = allStats?.categories.find(
      (s) => s.categoryId === targetCat?.id
    );

    const imageBuffer = await renderProfileCard({
      name: user.name,
      avatarUrl: user.avatarUrl,
      country: user.country,
      categoryCode,
      level,
      stats: categoryStats,
      diff,
      topScores: scores?.content ?? [],
      categoryIdToCode,
    });

    await interaction.editReply({
      files: [new AttachmentBuilder(imageBuffer, { name: "profile-card.png" })],
    });
  },
};

export default get;
