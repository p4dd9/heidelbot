import cron from 'node-cron';
import fetch from 'node-fetch';
import { createCanvas } from 'canvas';
import { LOCATION, OPEN_WEATHER_MAP_CONFIG } from './config';
import { sendMessageToChannel, sendAttachment } from '../discordClient';
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
            const url = `${this.basePath}/onecall?lat=${LOCATION.MAGARETEN.lat}&lon=${LOCATION.MAGARETEN.lng}&appid=${this.apiKey}&units=metric`;
            const res = await fetch(url);
            const data = await res.json();

            // handle hourly
            if (data.hourly) {
                sendAttachment(
                    WeatherClient.drawWeatherForecast(
                        WeatherClient.prepareHourlyWeatherForecastData(
                            data.hourly,
                        ),
                    ),
                );
            }

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

    static prepareHourlyWeatherForecastData(data) {
        const hourlyTemp = [];
        const startTime = new Date(data[0].dt * 1000);
        const maxForecastTime = new Date(
            new Date(startTime).getTime() + 60 * 60 * 24 * 1000,
        );
        const reportInterval = 4;

        for (let i = 0; i < data.length; i += reportInterval) {
            const hour = data[i];
            if (new Date(hour.dt * 1000) > maxForecastTime) {
                break;
            }

            hourlyTemp.push({
                hour: WeatherClient.formatUNIXtoDate(hour.dt),
                temp: hour.temp,
            });
        }
        return hourlyTemp;
    }

    static drawWeatherForecast(hourlyWeatherData) {
        const width = 600;
        const height = 200;
        const widthBetween = width / hourlyWeatherData.length;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < hourlyWeatherData.length; i += 1) {
            const data = hourlyWeatherData[i];
            ctx.fillStyle = 'red';
            ctx.fillText(data.hour, i * widthBetween, 50);
            ctx.fillText(data.temp, i * widthBetween, 150);
        }

        return canvas.toDataURL();
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
            {
                dateStyle: 'medium',
            },
        )} until ${WeatherClient.formatUNIXtoDate(end, {
            dateStyle: 'medium',
        })}. ${description}`;
    }

    static formatUNIXtoDate(
        timestamp,
        dateStyle = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        },
    ) {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('de-AT', dateStyle).format(date);
    }
}
