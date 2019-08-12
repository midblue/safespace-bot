const db = require('../db/firestore')
const blacklistedWord = require('../commands/blacklistedword')
const contactGuildAdmin = require('./contactGuildAdmin')

module.exports = async guild => {
  console.log('Initiating scan of all old messages.')
  const blacklistedWordRegex = blacklistedWord.regex(
    await db.getGuildSettings({ guildId: guild.id })
  )

  const channelScans = guild.channels.map(channel => {
    if (channel.type != 'text') return

    return new Promise(async resolve => {
      const foundPastInfractions = []
      let oldestMessageId = null
      let messages
      messages = await channel.messages.fetch({ limit: 50 }).catch(err => {
        console.error(
          'Missing permissions to get channel messages!',
          channel.name
        )
        messages = null
        // contactGuildAdmin({
        //   guild: msg.guild,
        //   message: `I don't have permission to read past messages on your server. Kick SafeSpace and use this link to re-add with proper permissions. https://discordapp.com/oauth2/authorize?client_id=605039242309140483&scope=bot&permissions=76800`,
        // })
      })
      while (messages && messages.keyArray().length > 0) {
        console.log(
          `Scanning ${messages.keyArray().length} messages from #${
            channel.name
          }...`
        )
        oldestMessageId = messages.last().id
        messages
          .filter(
            message =>
              !message.author.bot &&
              blacklistedWordRegex.exec(message.cleanContent)
          )
          .forEach(message => {
            return foundPastInfractions.push({
              userId: message.author.id || message.author.user.id,
              infraction: {
                date: message.createdAt,
                guild: message.guild.name,
                guildId: message.guild.id,
                channel: message.channel ? message.channel.name : null,
                fullMessage: message.cleanContent,
                messageId: message.id,
              },
            })
          })
        messages = await channel.messages.fetch({
          limit: 50,
          before: oldestMessageId,
        })
      }
      console.log('Done scanning', channel.name)
      resolve(foundPastInfractions)
    })
  })
  Promise.all(channelScans).then(async allInfractionsAsNestedArray => {
    const allInfractions = [].concat
      .apply([], allInfractionsAsNestedArray)
      .filter(i => i)
    for (let infraction of allInfractions) await db.addInfraction(infraction)
    // todo should we tell admins about these?
  })
}
