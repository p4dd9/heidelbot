require("dotenv").config();
const fetch = require("node-fetch");
const Discord = require("discord.js");
const discordClient = new Discord.Client();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 9786;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 *
 * BODY
 *
 * {
 *    "player_name": "p4dd9",
 *    "game": {
 *        "current_players": 2,
 *        "max_players": 20
 *    },
 *    "timestamp":1605472293
 * }
 *
 *
 */

app.post("/mcplayerjoined", (request, response) => {
  const { timestamp, player_name, game } = request.body;
  const { current_players, max_players } = game;

  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = ("0" + date.getMinutes()).substr(-2);
  const seconds = ("0" + date.getSeconds()).substr(-2);
  const formattedTime = `${day}/${month}/${year} um ${hours}:${minutes}:${seconds}`;
  const message = `:pick: **${player_name}** joined the minecraft server! **${current_players}/${max_players}** players live. *[${formattedTime}]*`;
  console.log(message);

  sendMessageToMCChannel(message);

  response.json({ requestBody: request.body });
});

app.listen(port, () => {
  console.log(`Started on PORT ${port}`);
});

const TOKEN = Object.freeze({
  DISCORD: process.env.DISCORD_TOKEN,
  GIPHY: process.env.GIPHY_TOKEN,
  MC_STATUS_URL: process.env.MC_STATUS_URL,
});

const URLS = Object.freeze({
  GIPHY_RANDOM: "https://api.giphy.com/v1/gifs/random?api_key=" + TOKEN.GIPHY,
});

const getRandomGiphyByTag = async (tag) => {
  const response = await fetch(`${URLS.GIPHY_RANDOM}&tag=${tag}`);
  return (await response.json()).data.url;
};

const fetchMCServerStatus = async () => {
  const response = await fetch(TOKEN.MC_STATUS_URL);
  return await response.json();
};

const sendMessageToMCChannel = function (message) {
  const channel = discordClient.channels.cache.get("776203480880119818");
  channel.send(message);
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
