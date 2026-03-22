import { Events } from "discord.js";
import type { ArBot } from "../client.js";
import { publishRoleMessage } from "./reaction-roles.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: ArBot) {
    console.log(`Ready as ${client.user?.tag}`);
    try {
      await publishRoleMessage(client);
    } catch (err) {
      console.error("[ReactionRoles] Failed to publish role message:", err);
    }
  },
};
