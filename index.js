const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
client.login(token); 

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



