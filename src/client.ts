import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { MilestoneWebSocket } from "./services/milestone-ws.js";
import type { ScoreWebSocket } from "./services/score-ws.js";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class ArBot extends Client {
  commands = new Collection<string, Command>();
  scoreWs?: ScoreWebSocket;
  milestoneWs?: MilestoneWebSocket;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [Partials.Message, Partials.Reaction, Partials.User],
    });
  }
}
