import { CONFIG } from './discord/discordConfig';
import { discordClient } from './discord/discordClient';
import './server/server';

import { WeatherClient } from './discord/weather/WeatherClient';

async function startApp() {
    await discordClient.login(CONFIG.DISCORD_TOKEN);

    const weatherClient = new WeatherClient();
    weatherClient.start();
}

startApp();
