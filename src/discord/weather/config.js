require('dotenv').config();

export const OPEN_WEATHER_MAP_CONFIG = Object.freeze({
    OPEN_WEATHER_MAP_BASE_PATH: 'https://api.openweathermap.org/data/2.5/',
    OPEN_WEATHER_MAP_API_KEY: process.env.OPEN_WEATHER_MAP_API_KEY,
});

export const LOCATION = Object.freeze({
    MAGARETEN: {
        lat: '48.18865135273521',
        lng: '16.356794549376644',
    },
});
