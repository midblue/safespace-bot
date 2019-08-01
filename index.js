require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const botId = '605039242309140483'
const commands = require('./commands/index')
const joinServer = require('./events/joinServer')
const leaveServer = require('./events/leaveServer')
const privateMessage = require('./events/privateMessage')
const guildMessage = require('./events/guildMessage')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  // client.user.setPresence({ game: { name: '!info' }, status: 'online' })
  //todo presence doesn't seem to work
})

client.on('message', async msg => {
  if (msg.author.id === botId) return

  if (!msg.guild || !msg.guild.available) return privateMessage(msg)

  return guildMessage(msg)
})

//joined a server
client.on('guildCreate', joinServer)

//removed from a server
client.on('guildDelete', leaveServer)

// todo search history when it joins a server
// todo search database when new user joins a server
// todo alert other servers a user is in when they use hate speech (after a delay to give admins a chance to forgive)

client.login(process.env.DISCORD_TOKEN)
