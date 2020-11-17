require("dotenv").config();
export const CONFIG = Object.freeze({
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  GIPHY_TOKEN: process.env.GIPHY_TOKEN,
  MC_STATUS_URL: process.env.MC_STATUS_URL,
});
