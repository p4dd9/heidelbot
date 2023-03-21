require('dotenv').config();

export const OPEN_WEATHER_MAP_CONFIG = Object.freeze({
    OPEN_WEATHER_MAP_BASE_PATH: 'https://api.openweathermap.org/data/2.5/',
    OPEN_WEATHER_MAP_API_KEY: process.env.OPEN_WEATHER_MAP_API_KEY,
});

export const LOCATION = Object.freeze({
    SIMMERING: {
        lat: '48.1626565',
        lng: '16.4545884',
    },
});
