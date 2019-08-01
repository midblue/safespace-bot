const db = require('../db/firestore')
const {
  getUserInGuildFromId,
  getAllOffendersInGuild,
  getLabelFromUser,
} = require('../commonFunctions')

module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(l|list|narc|offenders)`, 'gi')
  },
  async action(msg, options) {
    const offendersInGuild = (
      (await getAllOffendersInGuild(msg.guild)) || []
    ).filter(entry => entry.infractionsCount > 0)

    if (offendersInGuild.length === 0)
      return msg.channel.send(
        `\`\`\`Great news! There are no hate speech users in this server.\`\`\``
      )

    msg.channel.send(`\`\`\`All hate speech users in this server:

${offendersInGuild
  .map(o => {
    const userObject = getUserInGuildFromId(msg.guild, o.userId)
    return `${getLabelFromUser(userObject)} has used hate speech ${
      o.infractionsCount
    } time${o.infractionsCount === 1 ? '' : 's'}.`
  })
  .join('\n')}

Type ${options.prefix}user <username> to learn more about any user.\`\`\``)
  },
}
