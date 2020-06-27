const db = require('../db/firestore')
const { getUserInGuildFromId, getLabelFromUser } = require('../commonFunctions')
const contactGuildAdmin = require('../actions/contactGuildAdmin')
const { reply, send } = require('../actions/replyInChannel')
const contactOtherServersAUserIsIn = require('../actions/contactOtherServersAUserIsIn')

module.exports = {
  regex(options) {
    return new RegExp(
      `${
        process.env.SCAN_INSIDE_WORDS === 'true' ? `` : `(?:\\s|^)`
      }(${options.blacklistedWords.full.join('|')})${
        process.env.SCAN_INSIDE_WORDS === 'true' ? `` : `(?:\\s|$)`
      }`,
      'gim',
    )
  },
  action(msg, options, match, typedUser, sender, client) {
    if (!match[1]) return
    console.log(`*** ${msg.guild.name} - Blacklisted Word: ${match[1]}`)
    const blacklistedWordsUsed = []
    const regex = new RegExp(
      `\\b(${options.blacklistedWords.full.join('|')})\\b`,
      'gim',
    )
    let matchedWord = regex.exec(msg.cleanContent)
    while (matchedWord != null) {
      blacklistedWordsUsed.push(matchedWord[1])
      matchedWord = regex.exec(msg.cleanContent)
    }

    reply(msg, `\`${options.message}\``)

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

    msg.delete(1000).catch(err => {
      if (err.message === 'Unknown Message') return // already deleted
      contactGuildAdmin({
        guild: msg.guild,
        options,
        msg,
        message: `I don't have permission to manage messages on your server. Kick SafeSpace and use this link to re-add with proper permissions. https://discordapp.com/oauth2/authorize?client_id=605039242309140483&scope=bot&permissions=76800`,
      })
      console.error(
        'Missing permissions to delete!',
        msg.guild.name,
        msg.channel.name,
      )
    })

    contactGuildAdmin({
      guild: msg.guild,
      options,
      msg,
      message: `Heads up! \`${getLabelFromUser(
        getUserInGuildFromId(msg.guild, sender.id),
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
        getUserInGuildFromId(msg.guild, sender.id),
      )}\` just used hate speech on the server \`${msg.guild.name}\`.
Here's what they said: 
\`\`\`${infraction.fullMessage}\`\`\``,
    })

    db.incrementModContactEvents()
  },
}
