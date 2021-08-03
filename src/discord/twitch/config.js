require('dotenv').config();

export const TWITCH_VAR = Object.freeze({
    SECRET: process.env.TWITCH_SECRET,
    CLIENT_ID: process.env.TWITCH_CLIENT_ID,
});
