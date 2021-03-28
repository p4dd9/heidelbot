import { getRandomGiphyByTag, fetchMCServerStatus } from './utils';
import { COMMAND } from './consts/command';

export async function handleServerStatusCommand(message) {
    const mcServerStatus = await fetchMCServerStatus();
    const { players, version, online } = mcServerStatus;
    const { max: maxPlayerCount, online: currentPlayerCount } = players;

    message.reply(
        `Slothyx Minecraft Server is ${
            online ? '**RUNNING**' : '**DOWN**'
        } on v${version}. Players playing: [${currentPlayerCount}/${maxPlayerCount}] ⛏💎`,
    );
}

export async function handleMcMemeCommand(message) {
    const memeURL = await getRandomGiphyByTag('minecraft');
    message.channel.send(`${memeURL}`);
}

export async function handleHelpCommand(message) {
    const commands = Object.values(COMMAND).join(', !');
    await message.reply(`At your service!: !${commands}`);
}
