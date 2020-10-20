// todo
/*

add r*t*rd? t**nny?
private lists
whitelist


*/

require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const botId = process.env.BOT_ID
const joinServer = require('./events/joinServer')
const leaveServer = require('./events/leaveServer')
const privateMessage = require('./events/receivePrivateMessage')
const guildMessage = require('./events/receiveGuildMessage')
const otherMemberJoinServer = require('./events/otherMemberJoinServer')
const db = require('./db/firestore')

// const launchTime = Date.now()
let messagesScannedSinceLastNotification = 0
setInterval(() => {
  if (messagesScannedSinceLastNotification > 0) {
    console.log(`${messagesScannedSinceLastNotification} messages scanned.`)
    db.addToTotalScanned(messagesScannedSinceLastNotification)
  }
  messagesScannedSinceLastNotification = 0
}, 1 * 60 * 60 * 1000)

client.on('ready', async () => {
  console.log(
    `Logged in as ${client.user.tag} in ${
      (await client.guilds.cache.array()).length
    } guilds`,
  )
  client.user.setActivity('s!info', { type: 'LISTENING' })
})

client.on('message', async msg => {
  messagesScannedSinceLastNotification++
  if (!msg.author || msg.author.bot || msg.author.id === botId) return
  if (!msg.guild || !msg.guild.available) return privateMessage(msg)
  return guildMessage(msg, client)
})

// joined a server
client.on('guildCreate', joinServer)

// removed from a server
client.on('guildDelete', leaveServer)

// other user joins a guild
client.on('guildMemberAdd', otherMemberJoinServer)

client.login(process.env.DISCORD_TOKEN)
