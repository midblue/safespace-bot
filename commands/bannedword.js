module.exports = {
  regex(options) {
    const wordList = [
      ...options.bannedWords,
      ...options.bannedWords.map(w => w + 's'),
    ]
    return new RegExp(`\\b(${wordList.join('|')})\\b`, 'gim')
  },
  action(msg, options) {
    msg.reply(`\`${options.calloutMessage}\``)
  },
}
