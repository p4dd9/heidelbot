import fetch from "node-fetch";
import { CONFIG } from "./discordConfig";

const URLS = Object.freeze({
  GIPHY_RANDOM:
    "https://api.giphy.com/v1/gifs/random?api_key=" + CONFIG.GIPHY_TOKEN,
});

export const getRandomGiphyByTag = async (tag) => {
  const response = await fetch(`${URLS.GIPHY_RANDOM}&tag=${tag}`);
  return (await response.json()).data.url;
};

export const fetchMCServerStatus = async () => {
  const response = await fetch(CONFIG.MC_STATUS_URL);
  return await response.json();
};

// https://stackoverflow.com/questions/28735459/how-to-validate-youtube-url-in-client-side-in-text-box
export const validateYouTubeUrl = function (url) {
  const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return url.match(regExp) ? true : false;
};
