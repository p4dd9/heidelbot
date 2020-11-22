import ytdl from "ytdl-core";
import {
  validateYouTubeUrl as validYoutubeURL,
  isInVoiceChannel,
} from "./utils";
import { CHANNEL } from "./consts/channel";
import { COMMAND } from "./consts/commands";

const queue = new Map();
const options = {
  quality: "highestaudio",
};

export async function handleMusicCommand(command, message) {
  if (message.channel.id !== CHANNEL.musicBot || !isInVoiceChannel(message)) {
    return;
  }

  const serverQueue = queue.get(message.guild.id);
  if (command === COMMAND.play) {
    executePlay(message, serverQueue);
    return;
  } else if (command === COMMAND.skip) {
    skip(message, serverQueue);
    return;
  } else if (command === COMMAND.pause) {
    pause(message, serverQueue);
    return;
  } else if (command === COMMAND.resume) {
    resume(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
}

async function executePlay(message, serverQueue) {
  const args = message.content.split(" ");
  const voiceChannel = message.member.voice.channel;

  if (!validYoutubeURL(args[1])) {
    return message.channel.send("Please enter a valid youtube URL.");
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
      const connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function pause(message, serverQueue) {
  if (!serverQueue) {
    return message.channel.send("There is no song that I could skip!");
  }
  serverQueue.connection.dispatcher.pause();
}

function resume(message, serverQueue) {
  if (!serverQueue) {
    return message.channel.send("There is no song that I could skip!");
  }

  serverQueue.connection.dispatcher.resume();
}

function skip(message, serverQueue) {
  if (!serverQueue) {
    return message.channel.send("There is no song that I could skip!");
  }

  if (serverQueue.connection.dispatcher) {
    serverQueue.connection.dispatcher.end();
    return message.channel.send("Skipping song!");
  }
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url), options)
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => {
      console.error(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
