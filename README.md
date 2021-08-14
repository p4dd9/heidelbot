# heidelbot

Install dependencies (requires node+npm)

```
npm install
```

Create `.env` file and add required tokens

```
GIPHY_TOKEN=
DISCORD_TOKEN=
MC_STATUS_URL=
OPEN_WEATHER_MAP_API_KEY=
TWITCH_CLIENT_ID=
TWITCH_SECRET=
```

Dev locally

```
npm run watch
npm run demon
```

Update `channel.js` accordingly with your channel IDs

## SSH Deployment

Zip current directory (use `-x ".git"` to ignore unecessary folders) and upload to server via ssh

```
zip -r heidelbot.zip heidelbot
scp -r heidelbot.zip [USER]@[USER_IP]:[REMOTE_TARGET_DIRECTORY]
```

Build image and run

```
unzip heidelbot.zip # unzip directory
docker build -t heidelbot . # build from current directory
docker run -d -p 8080:3000 -p 9786:9786 heidelbot # run image
```
