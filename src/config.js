require("dotenv").config();
export const TOKEN = Object.freeze({
  DISCORD: process.env.DISCORD_TOKEN,
  GIPHY: process.env.GIPHY_TOKEN,
  MC_STATUS_URL: process.env.MC_STATUS_URL,
});
