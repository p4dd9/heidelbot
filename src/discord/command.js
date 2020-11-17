import { getRandomGiphyByTag, fetchMCServerStatus } from "./utils";

export const handleCommand = function (message, command) {
  switch (command) {
    case "mcserverstatus": {
      handleServerStatusCommand(message);
      break;
    }

    case "mcmeme": {
      handleMcMemeCommand(message);
      break;
    }

    case "goodnight": {
      handleGoodnightCommand(message);
      break;
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
