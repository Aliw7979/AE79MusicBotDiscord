const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const queue = new Map();
const client = new Discord.Client();



client.once('ready', () => {
    console.log('Hell Yeah! :)) ');
   });
client.once('reconnecting', () => {
 console.log('Trying! :D');
});
client.once('disconnect', () => {
 console.log('Disconnect! ;C ');
});

client.on('message', async message => {
  if (message.author.bot) return; //if messege was from the bot
  if (!message.content.startsWith(prefix)) return;//if user didnt write prefix

    const serverQueue = queue.get(message.guild.id);

if (message.content.startsWith(`${prefix}play`) || message.content.startsWith(`${prefix}p`)) {
    execute(message, serverQueue);
    return;
} else if (message.content.startsWith(`${prefix}skip`) || message.content.startsWith(`${prefix}s`)) {
    skip(message, serverQueue);
    return;
} else if (message.content.startsWith(`${prefix}stop`) || message.content.startsWith(`${prefix}st`)) {
    stop(message, serverQueue);
    return;
} else {
    message.channel.send("Are u dumb or something?!");
}
})




async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "Hey Dumb you should be in voice chat channel ;) "
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "Goddamn! gimme permission to connect and speak! gimme that shits :))"
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
          volume: 4,
          playing: true
        };
    
        queue.set(message.guild.id, queueContruct);
    
        queueContruct.songs.push(song);
    
        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          play(message.guild, queueContruct.songs[0]);
        } 
        catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
    }   
    else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue buddy!`);
        }
}
    


function stop(message, serverQueue) {
        if (!message.member.voice.channel)
          return message.channel.send(
            "Hey though guy you should be in voice channel to stop things!"
          );
          
        if (!serverQueue)
          return message.channel.send("There is no song,you can't stop nothing,can you?!");
          
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
}


function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }


  client.login(token); 



