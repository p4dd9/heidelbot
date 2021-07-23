import cron from 'node-cron';
import fetch from 'node-fetch';
import { LOCATION, OPEN_WEATHER_MAP_CONFIG } from './config';
import { sendMessageToChannel } from '../discordClient';
import { CHANNEL } from '../consts/channel';

export class WeatherClient {
    apiKey;

    basePath;

    constructor() {
        this.basePath = OPEN_WEATHER_MAP_CONFIG.OPEN_WEATHER_MAP_BASE_PATH;
        this.apiKey = OPEN_WEATHER_MAP_CONFIG.OPEN_WEATHER_MAP_API_KEY;
    }

    start() {
        cron.schedule('0 6 * * *', () => {
            this.fetchForeCast();
        });
    }

    async fetchForeCast() {
        try {
            const res = await fetch(
                `${this.basePath}/onecall?lat=${LOCATION.MAGARETEN.lat}&lon=${LOCATION.MAGARETEN.lng}&appid=${this.apiKey}&units=metric`,
            );
            const data = await res.json();

            // handle current weather
            if (data.current) {
                sendMessageToChannel(
                    WeatherClient.formatCurrent(data.current),
                    CHANNEL.weather,
                );
            }

            // handle alerts
            if (data.alerts.length && data.alerts.length > 0) {
                for (const alert of data.alerts) {
                    sendMessageToChannel(
                        WeatherClient.formatAlert(alert),
                        CHANNEL.weather,
                    );
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static formatCurrent(current) {
        const { temp, feels_like } = current;
        return `🌡️ Current temperature **${temp}°C** feels like ${feels_like}°C.`;
    }

    static formatAlert(alert) {
        const { sender_name, event, start, end, description } = alert;

        return `🚨 **${sender_name}** reports **${event}** for ${WeatherClient.formatUNIXtoDate(
            start,
        )} until ${WeatherClient.formatUNIXtoDate(end)}. ${description}`;
    }

    static formatUNIXtoDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('de-AT', {
            dateStyle: 'medium',
        }).format(date);
    }
}
