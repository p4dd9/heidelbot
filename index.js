require("dotenv").config();
const fetch = require("node-fetch");
const Discord = require("discord.js");
const discordClient = new Discord.Client();

const TOKEN = Object.freeze({
  DISCORD: process.env.DISCORD_TOKEN,
  GIPHY: process.env.GIPHY_TOKEN,
  MC_STATUS_URL: process.env.MC_STATUS_URL,
});

const URLS = Object.freeze({
  GIPHY_RANDOM: "https://api.giphy.com/v1/gifs/random?api_key=" + TOKEN.GIPHY,
});

const getRandomGiphy = async () => {
  const response = await fetch(URLS.GIPHY_RANDOM);
  return (await response.json()).data.url;
};

const getRandomGiphyByTag = async (tag) => {
  const response = await fetch(`${URLS.GIPHY_RANDOM}&tag=${tag}`);
  return (await response.json()).data.url;
};

const fetchMCServerStatus = async () => {
  const response = await fetch(TOKEN.MC_STATUS_URL);
  return await response.json();
};

discordClient.login(TOKEN.DISCORD);

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
