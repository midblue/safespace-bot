const db = require('../db/firestore')
const { getUserInGuildFromId, getLabelFromUser } = require('../commonFunctions')
const contactGuildAdmin = require('../actions/contactGuildAdmin')
const contactOtherServersAUserIsIn = require('../actions/contactOtherServersAUserIsIn')

module.exports = {
  regex(options) {
    return new RegExp(
      `\\b(${options.blacklistedWords.full.join('|')})\\b`,
      'gim'
    )
  },
  action(msg, options, match, typedUser, sender, client) {
    console.log(`*** ${msg.guild.name} - Blacklisted Word: ${match[1]}`)
    const blacklistedWordsUsed = []
    const regex = new RegExp(
      `\\b(${options.blacklistedWords.full.join('|')})\\b`,
      'gim'
    )
    let matchedWord = regex.exec(msg.cleanContent)
    while (matchedWord != null) {
      blacklistedWordsUsed.push(matchedWord[1])
      matchedWord = regex.exec(msg.cleanContent)
    }
    msg.reply(`\`${options.message}\``)
    const infraction = {
      date: msg.createdAt,
      guild: msg.guild.name,
      guildId: msg.guild.id,
      channel: msg.channel ? msg.channel.name : null,
      fullMessage: msg.cleanContent,
      messageId: msg.id,
    }
    db.addInfraction({
      userId: sender.id,
      infraction,
    })

    msg.delete().catch(console.error)

    contactGuildAdmin({
      guild: msg.guild,
      options,
      message: `Heads up! \`${getLabelFromUser(
        getUserInGuildFromId(msg.guild, sender.id)
      )}\` just used hate speech in \`#${
        infraction.channel
      }\` on your server \`${msg.guild.name}\`.
Here's what they said: 
\`\`\`${infraction.fullMessage}\`\`\``,
    })

    contactOtherServersAUserIsIn({
      client,
      infractionMessageId: msg.id,
      user: msg.author,
      sourceGuildId: msg.guild.id,
      message: `Heads up! \`${getLabelFromUser(
        getUserInGuildFromId(msg.guild, sender.id)
      )}\` just used hate speech on the server \`${msg.guild.name}\`.
Here's what they said: 
\`\`\`${infraction.fullMessage}\`\`\``,
    })
  },
}
