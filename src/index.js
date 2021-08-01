import { CONFIG } from './discord/discordConfig';
import { discordClient } from './discord/discordClient';
import './server/server';
import { WeatherClient } from './discord/weather/WeatherClient';

async function startApp() {
    await discordClient.login(CONFIG.DISCORD_TOKEN);
    discordClient.on('ready', () => {
        console.info(`Logged in as ${discordClient.user.tag}!`);
        const weatherClient = new WeatherClient();
        weatherClient.start();
    });
}

startApp();
