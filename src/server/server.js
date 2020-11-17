import express from "express";
import bodyParser from "body-parser";
import { sendMessageToChannel } from "../discord/discordClient";
import { CONFIG } from "./serverConfig";

const app = express();
const port = CONFIG.port;

const channel = {
  minecraft: "776203480880119818",
  minecraftlogs: "778311548534784020",
};

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
 *    }
 * }
 *
 *
 */

app.post("/mcplayerjoin", (request, response) => {
  const { player_name, game } = request.body;
  const { current_players, max_players } = game;
  const message = `:pick: **${player_name}** joined the minecraft server! **${current_players}/${max_players}** players live.`;
  console.log(message);
  sendMessageToChannel(message, channel.minecraftlogs);
  response.json({ requestBody: request.body });
});

app.post("/mcplayerleave", (request, response) => {
  const { player_name, game } = request.body;
  const { current_players, max_players } = game;
  const message = `:pick: **${player_name}** left the minecraft server! **${current_players}/${max_players}** players live.`;
  console.log(message);
  sendMessageToChannel(message, channel.minecraftlogs);
  response.json({ requestBody: request.body });
});

app.listen(port, () => {
  console.log(`Started on PORT ${port}`);
});
