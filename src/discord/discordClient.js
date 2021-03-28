import Discord from 'discord.js';
import { CONFIG } from './discordConfig';
import { COMMAND_PREFIX, COMMAND } from './consts/command';
import { handleMusicCommand } from './youtubeHandler';
import {
    handleServerStatusCommand,
    handleMcMemeCommand,
    handleHelpCommand,
} from './commandHandler';

export const discordClient = new Discord.Client();

async function handleGoodnightCommand(message) {
    await message.reply('Good night! 🐱💤');
    discordClient.destroy();
}

export const handleCommand = (message, command) => {
    switch (command) {
        case COMMAND.mc_serverstatus: {
            handleServerStatusCommand(message);
            break;
        }
        case COMMAND.mc_meme: {
            handleMcMemeCommand(message);
            break;
        }
        case COMMAND.audio_setvolume:
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
            message.channel.send('You need to enter a valid command!');
        }
    }
};

discordClient.login(CONFIG.DISCORD_TOKEN);

discordClient.on('ready', () => {
    console.info(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', async (message) => {
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot) {
        return;
    }
    const args = message.content.slice(COMMAND_PREFIX.length).trim().split(' ');
    const msgCommand = args.shift().toLowerCase();
    handleCommand(message, msgCommand);
});

export const sendMessageToChannel = (message, channelId) => {
    const channel = discordClient.channels.cache.get(channelId);
    channel.send(message);
};
