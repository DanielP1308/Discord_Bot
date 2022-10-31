const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./auth.json');
const XMLHttpRequest = require('xhr2');
//import fetch from 'node-fetch';


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

var ghibliObject = [];
var animeObject = [];
var arrlen = 0;
var keys = [];


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
    keys = Object.keys(ghibliObject);
  };
  // Send request
  request.send();
  return ghibliObject;
}

function getAnime(id) {
  var request = new XMLHttpRequest();

  request.open('GET', `https://api.jikan.moe/v4/anime/${ id }/full`, true);
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response);
      //const obj = data;
      //data.forEach(anime => {
      // Log each movie's title
        animeObject.push(data.data);
      //})
      console.log(animeObject)
    };
    
  // Send request
  request.send();
  return animeObject;
}
ghibliObject = getGhibli();
animeObject = getAnime(1);
// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', function(msg){
  console.log("Message Received!")
    if(msg.content === 'ghibli' || msg.content === 'g'){
        var getRandom = Math.floor(Math.random() * arrlen);
        const embededMsg = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(ghibliObject[keys[getRandom]].title)
          .setURL(`https://myanimelist.net/search/all?cat=all&q=${ghibliObject[keys[getRandom]].title.replaceAll(' ', '%20')}`)
          .setDescription(ghibliObject[keys[getRandom]].description)
          .setThumbnail(ghibliObject[keys[getRandom]].image)
          .addFields(
            { name: 'Director', value: ghibliObject[keys[getRandom]].director, inline: true },
            { name: 'Producer', value: ghibliObject[keys[getRandom]].producer, inline: true },
            { name: 'Release Date', value: ghibliObject[keys[getRandom]].release_date, inline: true }
          )
          .setImage(ghibliObject[keys[getRandom]].movie_banner)
          .setTimestamp()
          .setFooter({ text: 'DanielP1308', iconURL:  ghibliObject[keys[getRandom]].image });
        msg.reply({ embeds: [embededMsg] });
        console.log(ghibliObject[keys[getRandom]].title);
    }
});
// Login to Discord with your client's token
client.login(token);