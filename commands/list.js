const db = require('../db/firestore')
const { reply, send } = require('../actions/replyInChannel')
const {
  getUserInGuildFromId,
  getAllOffendersInGuild,
  getLabelFromUser,
} = require('../commonFunctions')

module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(list|narc|offenders|l)`, 'gi')
  },
  async action(msg, options) {
    console.log(`${msg.guild.name} - List`)
    const offendersInGuild = (
      (await getAllOffendersInGuild(msg.guild)) || []
    ).filter(entry => entry.infractionsCount > 0)

    if (offendersInGuild.length === 0)
      return send(
        msg,
        `\`\`\`Great news! There are no hate speech users in this server.\`\`\``,
      )

    let messagesToSend = [`All hate speech users in this server:`]
    let currentPositionInList = 0
    const perPost = 20
    while (currentPositionInList <= offendersInGuild.length) {
      const msgPieces = []
      while (
        currentPositionInList < currentPositionInList + perPost &&
        offendersInGuild[currentPositionInList]
      ) {
        const userObject = await getUserInGuildFromId(msg.guild, o.userId)
        msgPieces.push(
          `${getLabelFromUser(userObject)} has used hate speech ${
            o.infractionsCount
          } time${o.infractionsCount === 1 ? '' : 's'}.`,
        )
        currentPositionInList++
      }
      messagesToSend.push(msgPieces.join('\n') + `\`\`\``)
    }

    messagesToSend.push(
      `Type ${options.prefix}user <username> to learn more about any user.`,
    )

    messagesToSend.forEach(message => send(msg, message))
  },
}
