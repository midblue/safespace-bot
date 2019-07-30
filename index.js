require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const botId = '605039242309140483'
const commands = require('./commands/index')
const blacklistedWords = require('./blacklistedwords')
const db = require('./db/firestore')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setPresence({ game: { name: '!info' }, status: 'online' })
  //todo presence doesn't seem to work
})

const options = {
  prefix: '!',
  contactPoint: `jasp`,
  blacklistedWords,
  calloutMessage: `Hey! That kind of language is unacceptable. We take hate speech seriously around here.

The channel moderators have been notified, and your user id has been logged across all servers using this bot. Think twice before using hate speech next time!

(If you think you\'ve been flagged in error, reach out to the server admins to sort it out.)`,
}

client.on('message', async msg => {
  if (msg.author.id === botId) return
  if (!msg.guild || !msg.guild.available)
    return msg.channel.send(
      `\`\`\`This bot only works in a server channel for now.\`\`\``
    )

  if (await commands(msg, options)) return

  const sender = msg.author.id
  const allMembers = msg.guild.members
    .array()
    .map(m => m.id)
    .filter(id => id !== botId)
  console.log('sender:', sender, '~', 'allMembers:', allMembers)
})

//joined a server
client.on('guildCreate', guild => {
  console.log('Joined a new guild: ' + guild.name)
})
//todo set status to show !info
// todo search history when new word is added / joins a server
// todo and remove infractions when one is removed
// todo search database when new user joins a server
// todo alert other servers a user is in when they use hate speech (after a delay to give admins a chance to forgive)

//removed from a server
client.on('guildDelete', guild => {
  console.log('Left a guild: ' + guild.name)
})

client.login(process.env.DISCORD_TOKEN)
