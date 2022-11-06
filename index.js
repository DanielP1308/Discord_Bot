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

/*const getAnimeLogg = async() => {
  const res = await fetch(`https://api.jikan.moe/v4/anime/?q=one%20piece&limit=5`);
  const resData = await res.json();

  resData.data.forEach(anime => {
    animeObject.push(anime);
  });
}*/

async function getAnimeLogg() {
  const res = await fetch(`https://api.jikan.moe/v4/anime/?q=one%20piece&limit=5`);
  const resData = await res.json();

  resData.data.forEach(anime => {
    animeObject.push(anime);
  });
  keysSearchAnime = Object.keys(animeObject);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
    ghibliObject = getGhibli();
    getAnimeLogg();
});

client.on('messageCreate', function(msg){
  //animeObject = getAnime(5);
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
      /*const embededMsg = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(animeObject[0].data.title)
        .setURL(animeObject[0].data.url)
        .setDescription(animeObject[0].data.synopsis)
        .setThumbnail(animeObject[0].data.images.jpg.small_image_url)
        .setImage(animeObject[0].data.images.jpg.image_url)
        .setTimestamp()
        .setFooter({ text: 'DanielP1308' });
      msg.reply({ embeds: [embededMsg] });*/
      //console.log(animeObject[0]);
      getAnimeLogg();
      console.log(animeObject[keysSearchAnime[0]].title);
    }
});
// Login to Discord with your client's token
client.login(token);