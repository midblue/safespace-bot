const Discord = require('discord.js')
const client = new Discord.Client()
const botId = '605039242309140483'
const commands = require('./commands/index')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  console.log(commands)
  if (commands(msg)) return
  console.log(msg.member.id, '\n\n\n', msg.guild.members.array().map(m => m.id))
  // msg.reply('')
})

//joined a server
client.on('guildCreate', guild => {
  console.log('Joined a new guild: ' + guild.name)
})

//removed from a server
client.on('guildDelete', guild => {
  console.log('Left a guild: ' + guild.name)
})

client.login(process.env.DISCORD_TOKEN)
