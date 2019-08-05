const contactGuildAdmin = require('./contactGuildAdmin')

module.exports = {
  send(msg, text) {
    msg.channel.send(text).catch(err => {
      contactGuildAdmin({
        guild: msg.guild,
        message: `I don't have permission to send messages on your server. Kick SafeSpace and use this link to re-add with proper permissions. https://discordapp.com/oauth2/authorize?client_id=605039242309140483&scope=bot&permissions=76800`,
      })
      console.error('Missing permissions to send!', err.message)
    })
  },
  reply(msg, text) {
    msg.reply(text).catch(err => {
      contactGuildAdmin({
        guild: msg.guild,
        message: `I don't have permission to reply to messages on your server. Kick SafeSpace and use this link to re-add with proper permissions. https://discordapp.com/oauth2/authorize?client_id=605039242309140483&scope=bot&permissions=76800`,
      })
      console.error('Missing permissions to reply!', err.message)
    })
  },
}
