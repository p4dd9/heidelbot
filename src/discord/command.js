import { getRandomGiphyByTag, fetchMCServerStatus } from "./utils";
import { discordClient } from "./discordClient";
import { handleMusicCommand } from "./youtubeHandler";
import { COMMAND } from "./consts/commands";

export const handleCommand = function (message, command) {
  switch (command) {
    case COMMAND.mc_serverstatus: {
      handleServerStatusCommand(message);
      break;
    }
    case COMMAND.mc_meme: {
      handleMcMemeCommand(message);
      break;
    }
    case COMMAND.audio_play:
    case COMMAND.audio_skip:
    case COMMAND.audio_pause:
    case COMMAND.audio_resume: {
      handleMusicCommand(command, message);
      break;
    }
    case COMMAND.help: {
      handleHelpCommand(message);
      break;
    }
    case COMMAND.goodnight: {
      handleGoodnightCommand(message);
      break;
    }
    default: {
      message.channel.send("You need to enter a valid command!");
    }
  }
};

async function handleServerStatusCommand(message) {
  const mcServerStatus = await fetchMCServerStatus();
  const { players, version, online } = mcServerStatus;
  const { max: maxPlayerCount, online: currentPlayerCount } = players;
  console.log("!mcserverstatus");

  message.reply(
    `Slothyx Minecraft Server is ${
      online ? "**RUNNING**" : "**DOWN**"
    } on v${version}. Players playing: [${currentPlayerCount}/${maxPlayerCount}] ⛏💎`
  );
}

async function handleMcMemeCommand(message) {
  const memeURL = await getRandomGiphyByTag("minecraft");
  message.channel.send(`${memeURL}`);
}

async function handleGoodnightCommand(message) {
  await message.reply(`Good night! 🐱💤`);
  discordClient.destroy();
}

async function handleHelpCommand(message) {
  const commands = Object.values(COMMAND).join(", !");
  await message.reply(`At your service!: !${commands}`);
  discordClient.destroy();
}
