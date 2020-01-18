const Discord = require('discord.js');
var logger = require('winston');
const auth = require('./auth.json');
const StompJs = require('@stomp/stompjs');
const jimp = require('jimp');
Object.assign(global, { WebSocket: require('websocket').w3cwebsocket });

const channelID = '667972209163108374'
const client = new StompJs.Client();
client.brokerURL = "ws://159.89.201.140:15674/ws";

// async function resize() {
//   const image = await jimp.read('breath.gif');
//   await image.resize(500, jimp.AUTO);
// 	// Save and overwrite the image
// 	await image.writeAsync('breath-big.gif');
// }
client.onConnect = function(frame) {
  // Do something, all subscribes must be done is this callback
  // This is needed because this will be executed after a (re)connect
  console.log('connected')

  var subscription = client.subscribe("/topic/test",  function(message) {
    // called when the client receives a STOMP message from the server
    if (message.body) {
      console.log(message.body)

      // bot.uploadFile({
      //   to: channelID,
      //   message: 'A new guest has entered the chat',
      //   file: 'breath-big.gif'
      // })

      // bot.sendMessage({
      //   to: channelID,
      //   // message: 'https://purr.objects-us-east-1.dream.io/i/3vuUR.jpg',
      //   embed: {
      //     // color: 6826080,
      //     // footer: {
      //     //   text: ''
      //     // },
      //     image:
      //     {
      //       url: 'https://cdn.nekos.life/kiss/kiss_120.gif',
      //       width: 600
      //     },
      //     //title: 'Hello world',
      //   }
      // })

    } else {
      console.log("got empty message");
    }
  });
};


client.onStompError = function (frame) {
  // Will be invoked in case of error encountered at Broker
  // Bad login/passcode typically will cause an error
  // Complaint brokers will set `message` header with a brief message. Body may contain details.
  // Compliant brokers will terminate the connection after any error
  console.log('Broker reported error: ' + frame.headers['message']);
  console.log('Additional details: ' + frame.body);
};

client.activate();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const discordClient = new Discord.Client();
console.log(Discord.GuildMemberRoleStore)
discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', msg => {
  // if (message.substring(0, 1) == '!') {
  //   var args = message.substring(1).split(' ');
  //   var cmd = args[0];

  //   args = args.splice(1);
  //   console.log(args, cmd)
  // }

  if (msg.content === 'ping') {
    // msg.reply('pong');
    const embed = new Discord.MessageEmbed()
    .setTitle('Test')
    .setDescription(`**Level:** 33 \n**Exp:** 154 / 300\n**Rank:** 1st`)
    .setColor(0x00AE86)
    //.setThumbnail(user.displayAvatarURL);
    msg.reply(embed);
  }
});

discordClient.login(auth.token);
