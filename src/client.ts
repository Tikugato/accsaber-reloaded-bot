import {
  Client,
  Collection,
  GatewayIntentBits,
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class ArBot extends Client {
  commands = new Collection<string, Command>();

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds],
    });
  }
}
