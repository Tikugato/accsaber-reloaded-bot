import "dotenv/config";
import { ArBot } from "./client.js";
import commands from "./commands/index.js";
import { registerEvents } from "./events/index.js";

const client = new ArBot();
client.commands = commands;
registerEvents(client);

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN environment variable is required");
}

client.login(token);
