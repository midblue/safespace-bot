const Discord = require('discord.js')
const client = new Discord.Client()
const botId = '605039242309140483'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  console.log(msg.member.id, '\n\n\n', msg.guild.members.array().map(m => m.id))
  if (msg.content === 'ping') {
    msg.reply('Pong!')
  }
})

client.login(process.env.DISCORD_TOKEN)
