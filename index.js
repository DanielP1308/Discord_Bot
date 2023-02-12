const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./auth.json');
const { XMLHttpRequest } = require('xhr2');


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

var animeObject = new Array();
var keysSearchAnime = [];

async function searchAnime(search) {
  var animeData = [];
  const res = await fetch(`https://api.jikan.moe/v4/anime/?q=${ search }&limit=5`);
  const resData = await res.json();

  resData.data.forEach(anime => {
    animeData.push(anime);
  });
  keysSearchAnime = Object.keys(animeData);
  return animeData;
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
    //ghibliObject = getGhibli();
});

client.on('messageCreate', function(msg){
  console.log("Message Received!")
    var command =  msg.content.substring(0, 2)

    if(command === '-a') {
      var search = msg.content.substring(3)
      animeObject = searchAnime(search);
      var urlCorrect = search.replace(/ /g, '_')
      var embededMsg = new EmbedBuilder();
      var count = 0;
      
      animeObject.then(function(res) {
        console.log(res);
        
        embededMsg
        .setColor(0x0099FF)
        .setTitle(search)
        .setURL(`https://myanimelist.net/search/all?q=${ urlCorrect }&cat=all`)
        /*.setDescription(list[keysSearchAnime[0]].synopsis)
        .setThumbnail(list[keysSearchAnime[0]].images.jpg.small_image_url)
        .setImage(list[keysSearchAnime[0]].images.jpg.image_url)
        .setTimestamp()
        .setFooter({ text: 'DanielP1308' });*/
        for(var i = 0; i < 5; i++) {
          embededMsg.addFields({ name: `${i}:`, value: res[keysSearchAnime[i]].title, url: res[keysSearchAnime[i]].url })
        }
        msg.reply({ embeds: [embededMsg] });
      })
    }
});
// Login to Discord with your client's token
client.login(token);