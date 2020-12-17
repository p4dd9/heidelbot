import ytdl from "ytdl-core";
import { isValidYoutubeURL, isInVoiceChannel } from "./utils";
import { CHANNEL } from "./consts/channel";
import { COMMAND } from "./consts/commands";

const queue = new Map();

export async function handleMusicCommand(command, message) {
  if (message.channel.id !== CHANNEL.musicBot || !isInVoiceChannel(message)) {
    return;
  }

  const serverQueue = queue.get(message.guild.id);
  if (command === COMMAND.audio_play) {
    executePlay(message, serverQueue);
    return;
  } else if (command === COMMAND.audio_skip) {
    skip(message, serverQueue);
    return;
  } else if (command === COMMAND.audio_pause) {
    pause(message, serverQueue);
    return;
  } else if (command === COMMAND.audio_setvolume) {
    setVolume(message, serverQueue);
    return;
  } else if (command === COMMAND.audio_resume) {
    resume(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
}

async function executePlay(message, serverQueue) {
  const args = message.content.split(" ");
  const voiceChannel = message.member.voice.channel;

  if (!isValidYoutubeURL(args[1])) {
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
    return message.channel.send("There is no song that I could pause!");
  }
  serverQueue.connection.dispatcher.pause();
}

function resume(message, serverQueue) {
  if (!serverQueue) {
    return message.channel.send("There is no song that I could resume!");
  }

  serverQueue.connection.dispatcher.resume();
}

function setVolume(message, serverQueue) {
  const args = message.content.split(" ");
  if (args.length != 2 || !/(10|\d)/.test(args[1])) {
    return message.channel.send("Please enter a valid volume number 0-10.");
  }
  const newVolume = parseInt(args[1].match(/(10|\d)/)) / 100;
  serverQueue.connection.dispatcher.setVolume(newVolume);
  return message.channel.send(`Volume set to ${newVolume * 100}!`);
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
    .play(ytdl(song.url), {
      quality: "highestaudio",
    })
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
