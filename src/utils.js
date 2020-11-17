import fetch from "node-fetch";
import { TOKEN } from "./config";

const URLS = Object.freeze({
  GIPHY_RANDOM: "https://api.giphy.com/v1/gifs/random?api_key=" + TOKEN.GIPHY,
});

export const getRandomGiphyByTag = async (tag) => {
  const response = await fetch(`${URLS.GIPHY_RANDOM}&tag=${tag}`);
  return (await response.json()).data.url;
};

export const fetchMCServerStatus = async () => {
  const response = await fetch(TOKEN.MC_STATUS_URL);
  return await response.json();
};
