const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./auth.json');
const { XMLHttpRequest } = require('xhr2');


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

var ghibliObject = [];
var animeObject = new Array();
var arrlen = 0;
var keysGhibli = [];
var keysSearchAnime = [];


function getGhibli() {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);

  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    //const obj = data;
    data.forEach(movie => {
    // Log each movie's title
      ghibliObject.push(movie);
      arrlen++;
    });
    keysGhibli = Object.keys(ghibliObject);
  };
  // Send request
  request.send();
  return ghibliObject;
}

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
    ghibliObject = getGhibli();
});

client.on('messageCreate', function(msg){
  console.log("Message Received!")
    if(msg.content === 'ghibli' || msg.content === 'g'){
        var getRandom = Math.floor(Math.random() * arrlen);
        const embededMsg = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(ghibliObject[keysGhibli[getRandom]].title)
          .setURL(`https://myanimelist.net/search/all?cat=all&q=${ghibliObject[keysGhibli[getRandom]].title.replaceAll(' ', '%20')}`)
          .setDescription(ghibliObject[keysGhibli[getRandom]].description)
          .setThumbnail(ghibliObject[keysGhibli[getRandom]].image)
          .addFields(
            { name: 'Director', value: ghibliObject[keysGhibli[getRandom]].director, inline: true },
            { name: 'Producer', value: ghibliObject[keysGhibli[getRandom]].producer, inline: true },
            { name: 'Release Date', value: ghibliObject[keysGhibli[getRandom]].release_date, inline: true }
          )
          .setImage(ghibliObject[keysGhibli[getRandom]].movie_banner)
          .setTimestamp()
          .setFooter({ text: 'DanielP1308', iconURL:  ghibliObject[keysGhibli[getRandom]].image });
        msg.reply({ embeds: [embededMsg] });
        console.log(ghibliObject[keysGhibli[getRandom]].title);
    }
    if(msg.content === 'a') {
      animeObject = searchAnime('naruto');
      var embededMsg = new EmbedBuilder();
      var count = 0;
      
      animeObject.then(function(res) {
        console.log(res);
        
        embededMsg
        .setColor(0x0099FF)
        .setTitle("Search String")
        .setURL(res[keysSearchAnime[0]].url)
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