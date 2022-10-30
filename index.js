const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./auth.json');
const XMLHttpRequest = require('xhr2');
var request = new XMLHttpRequest();
request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

var ghibliObject = [];
var arrlen = 0;
var keys = [];

request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response)
  //const obj = data;
  data.forEach(movie => {
  // Log each movie's title
    ghibliObject.push(movie);
    arrlen++;
  });
  keys = Object.keys(ghibliObject);
};

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

// Open a new connection, using the GET request on the URL endpoint




// Send request
request.send();
// Login to Discord with your client's token
client.login(token);