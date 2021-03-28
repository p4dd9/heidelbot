import Discord from "discord.js";
import { CONFIG } from "./discordConfig";
import { handleCommand } from "./command";
import { COMMAND_PREFIX } from "./consts/command";

export const discordClient = new Discord.Client();

discordClient.login(CONFIG.DISCORD_TOKEN);

discordClient.on("ready", () => {
  console.info(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("message", async (message) => {
  if (!message.content.startsWith(commandPrefix) || message.author.bot) return;
  const args = message.content.slice(commandPrefix.length).trim().split(" ");
  const msgCommand = args.shift().toLowerCase();
  handleCommand(message, msgCommand);
});

export const sendMessageToChannel = function (message, channelId) {
  const channel = discordClient.channels.cache.get(channelId);
  channel.send(message);
};
