import { Events, MessageFlags } from "discord.js";
import type { ArBot } from "../client.js";
import type { Interaction } from "discord.js";
import { config } from "../config.js";
import { errorEmbed } from "../utils/embeds.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (
      config.allowedChannels.length > 0 &&
      interaction.channelId &&
      !config.allowedChannels.includes(interaction.channelId)
    ) {
      await interaction.reply({
        embeds: [errorEmbed("Not Allowed", "Commands are not available in this channel.")],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const client = interaction.client as ArBot;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`Error executing /${interaction.commandName}:`, err);
      const embed = errorEmbed(
        "Something went wrong",
        "An unexpected error occurred. Try again later."
      );
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  },
};
