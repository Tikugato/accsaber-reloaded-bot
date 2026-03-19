import "dotenv/config";
import { REST, Routes } from "discord.js";
import { config } from "./config.js";
import commands from "./commands/index.js";

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN environment variable is required");
}

const rest = new REST().setToken(token);

const body = commands.map((cmd) => cmd.data.toJSON());

console.log(`Registering ${body.length} commands...`);

rest
  .put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
    body,
  })
  .then(() => console.log("Commands registered."))
  .catch(console.error);
