const contactGuildAdmin = require('./contactGuildAdmin')

module.exports = {
  send(msg, text) {
    const messages = []
    let remainingText = text
    while (remainingText.length > 0) {
      messages.push(remainingText.substring(0, 1998))
      remainingText = remainingText.substring(1998)
    }
    for (let message of messages)
      msg.channel.send(message).catch((err) => {
        contactGuildAdmin({
          guild: msg.guild,
          msg,
          message: `I don't have permission to send messages on your server. Kick SafeSpace and use this link to re-add with proper permissions. https://discordapp.com/oauth2/authorize?client_id=605039242309140483&scope=bot&permissions=76800`,
        })
        console.error('Missing permissions to send!', err.message)
      })
  },
  reply(msg, text) {
    const messages = []
    let remainingText = text
    while (remainingText.length > 0) {
      messages.push(remainingText.substring(0, 1998))
      remainingText = remainingText.substring(1998)
    }
    for (let message of messages)
      msg.channel.send(message).catch((err) => {
        contactGuildAdmin({
          guild: msg.guild,
          msg,
          message: `I don't have permission to reply to messages on your server. Kick SafeSpace and use this link to re-add with proper permissions. https://discordapp.com/oauth2/authorize?client_id=605039242309140483&scope=bot&permissions=76800`,
        })
        console.error('Missing permissions to reply!', err.message)
      })
  },
}
