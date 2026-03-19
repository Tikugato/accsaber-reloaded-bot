import { Events } from "discord.js";
import type { ArBot } from "../client.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ArBot) {
    console.log(`Ready as ${client.user?.tag}`);
  },
};
