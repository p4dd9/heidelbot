import ytdl from "ytdl-core";
import { validateYouTubeUrl as validYoutubeURL } from "./utils";

const queue = new Map();
const MUSIC_COMMAND = {
  play: "play",
  skip: "skip",
  stop: "stop",
};

export async function handleMusicCommand(command, message) {
  const serverQueue = queue.get(message.guild.id);

  if (command === MUSIC_COMMAND.play) {
    executePlay(message, serverQueue);
    return;
  } else if (command === MUSIC_COMMAND.skip) {
    skip(message, serverQueue);
    return;
  } else if (command === MUSIC_COMMAND.stop) {
    stop(message, serverQueue);
    return;
  }
}

const executePlay = async function (message, serverQueue) {
  const args = message.content.split(" ");
  const voiceChannel = message.member.voice.channel;

  if (!validYoutubeURL(args[1])) {
    return message.channel.send("Please enter a valid youtube URL.");
  }

  if (!voiceChannel) {
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 1,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);
    queueContruct.songs.push(song);

    try {
      queueContruct.connection = await voiceChannel.join();
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(
      `**${song.title}** has been added to the queue!`
    );
  }
};

const skip = function (message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  }

  if (!serverQueue) {
    return message.channel.send("There is no song that I could skip!");
  }
  serverQueue.connection.dispatcher.end();
};

const stop = function (message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  }

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
};

const play = function (guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    console.log("Song is undefiend");
    return;
  }

  const { url, title } = song;

  const options = {
    quality: "highestaudio",
  };
  const dispatcher = serverQueue.connection
    .play(ytdl(url), options)
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${title}**`);
};
