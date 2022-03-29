const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name:'play',
    description:'Join voice channel and play music(yeah exactly from youtube).',
    async execute(message,args){
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.channel.send('Hey Dumb you should be in voice chat channel ;)');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
            "Goddamn! gimme permission to connect and speak! gimme that shits :))"
            );
        }
        if(!args.length) return message.channel.send('Play what? gimme the name nice guy!');

        const connection = await voiceChannel.join();
        const videoFinder = async (query) => {
            const result = await ytSearch(query);
            if(result.length > 1) return result.videos[0];
            else{
                return null;
            }
        }
        const video = await videoFinder(args.join(' '));
        if(video){
            const stream = ytdl(video.url,{filter:'audioonly'});
            connection.play(stream,{seek:0,volume:1})
            .on('finish',()=>{
                voiceChannel.leave();
            });
            await message.reply(':thumbsub: Playing ***${video.title}***')
        }else {
            message.channel.send('Nope there is no any video that match with your fucking expectation!')
        }
    }
}