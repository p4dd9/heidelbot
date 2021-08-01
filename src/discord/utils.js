import fetch from 'node-fetch';
import { CONFIG } from './discordConfig';

const URLS = Object.freeze({
    GIPHY_RANDOM: `https://api.giphy.com/v1/gifs/random?api_key=${CONFIG.GIPHY_TOKEN}`,
});

export const getRandomGiphyByTag = async (tag) => {
    const response = await fetch(`${URLS.GIPHY_RANDOM}&tag=${tag}`);
    return (await response.json()).data.url;
};

export const fetchMCServerStatus = async () => {
    const response = await fetch(CONFIG.MC_STATUS_URL);
    const data = response.json();
    return data;
};

// https://stackoverflow.com/questions/28735459/how-to-validate-youtube-url-in-client-side-in-text-box
export const isValidYoutubeURL = (url) => {
    const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return !!url.match(regExp);
};

export const isInVoiceChannel = (message) => {
    if (!message.member.voice.channel) {
        message.channel.send(
            'You have to be in a voice channel to stop the music!',
        );
        return false;
    }
    return true;
};

export const isDev = process.env.NODE_ENV === 'development';
