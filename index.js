const Discord = require('discord.js');
const client = new Discord.Client();
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const fs = require('fs')
const queue = new Map();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
  const command= require(`./commands/${file}`);
  client.commands.set(command.name,command)
}


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
    client.commands.get('play').execute(message, serverQueue);
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

client.login(token); 



