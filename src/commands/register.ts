import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../client.js";
import { ApiError } from "../api/client.js";
import {
  createDiscordLink,
  getDiscordLink,
  getDiscordLinkByUser,
} from "../api/discord-links.js";
import { config } from "../config.js";
import { errorEmbed, infoEmbed, successEmbed } from "../utils/embeds.js";

const register: Command = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Link your Discord account to your AccSaber profile")
    .addStringOption((option) =>
      option
        .setName("profile")
        .setDescription("BeatLeader URL, ScoreSaber URL, or player ID")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const input = interaction.options.getString("profile", true);

    try {
      const existing = await getDiscordLink(interaction.user.id);
      await interaction.editReply({
        embeds: [
          infoEmbed(
            "Already Registered",
            `Your Discord account is already linked to **${existing.playerName}** (\`${existing.userId}\`).`
          ),
        ],
      });
      return;
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 404)) throw err;
    }

    let link;
    try {
      link = await createDiscordLink(interaction.user.id, input);
    } catch (err) {
      if (err instanceof ApiError) {
        await interaction.editReply({
          embeds: [errorEmbed("Registration Failed", err.message)],
        });
        return;
      }
      throw err;
    }

    const guild = interaction.guild;
    if (guild && config.roles.player) {
      const member = await guild.members.fetch(interaction.user.id);
      await member.roles.add(config.roles.player);
    }

    await interaction.editReply({
      embeds: [
        successEmbed(
          "Registration Complete",
          `Linked to **${link.playerName}** (\`${link.userId}\`).`
        ),
      ],
    });
  },
};

export default register;
