const db = require('../db/firestore')

module.exports = {
  regex(options) {
    return new RegExp(
      `\\b(${options.blacklistedWords.full.join('|')})\\b`,
      'gim'
    )
  },
  action(msg, options, match, typedUser, sender) {
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
    db.addInfraction({
      userId: sender.id,
      infraction: {
        date: Date.now(),
        guild: msg.guild.name,
        guildId: msg.guild.id,
        channel: msg.channel ? msg.channel.name : null,
        fullMessage: msg.cleanContent,
        words: blacklistedWordsUsed,
      },
    })
    // todo contact admin
  },
}
