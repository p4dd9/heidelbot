import { CONFIG } from './discord/discordConfig';
import { discordClient } from './discord/discordClient';
import './server/server';
import { WeatherClient } from './discord/weather/WeatherClient';
import { isDev } from './discord/utils';

async function startApp() {
    if (isDev) {
        console.info('Starting in dev-mode.');
        const weatherClient = new WeatherClient();
        weatherClient.start();

        /* const twitchClient = new TwitchClient();
        twitchClient.start();*/
    } else {
        await discordClient.login(CONFIG.DISCORD_TOKEN);
        discordClient.on('ready', () => {
            console.info('Starting in production-mode.');
            console.info(`Logged in as ${discordClient.user.tag}!`);
            const weatherClient = new WeatherClient();
            weatherClient.start();

            /*const twitchClient = new TwitchClient();
            twitchClient.start();*/
        });
    }
}

startApp();
