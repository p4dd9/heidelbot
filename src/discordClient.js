import { getRandomGiphyByTag, fetchMCServerStatus } from "./utils";
import Discord from "discord.js";
import { TOKEN } from "./config";

const discordClient = new Discord.Client();

discordClient.login(TOKEN.DISCORD);

export const sendMessageToChannel = function (message, channelId) {
  const channel = discordClient.channels.cache.get(channelId);
  channel.send(message);
};

discordClient.on("ready", () => {
  console.info(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("message", async (message) => {
  if (message.content === "!mcserverstatus") {
    const mcServerStatus = await fetchMCServerStatus();
    const { players, version, online } = mcServerStatus;
    const { max: maxPlayerCount, online: currentPlayerCount } = players;

    message.reply(
      `Slothyx Minecraft Server is ${
        online ? "**RUNNING**" : "**DOWN**"
      } on v${version}. Players playing: [${currentPlayerCount}/${maxPlayerCount}] ⛏💎`
    );
  }
});

discordClient.on("message", async (message) => {
  if (message.content === "!mcmeme") {
    const memeURL = await getRandomGiphyByTag("minecraft");
    message.channel.send(`${memeURL}`);
  }
});

discordClient.on("message", async (message) => {
  if (
    message.content === "!goodnightbot" &&
    message.member.hasPermission("ADMINISTRATOR")
  ) {
    await message.reply(`Good night! 🐱💤`);
    discordClient.destroy();
  }
});
