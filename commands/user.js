const db = require('../db/firestore')
const { getLabelFromUser, formatInfractions } = require('../commonFunctions')
const defaultOptions = require('../defaultServerOptions')
const { reply, send } = require('../actions/replyInChannel')

module.exports = {
  expectsUserInRegexSlot: 2,
  regex(options) {
    return new RegExp(`^${options.prefix}(?:user|u)( ?)(.*)`, 'gi')
  },
  async action(msg, options, match, user) {
    console.log(`${msg.guild.name} - User`)
    options = options || defaultOptions
    if (!user && !match[2])
      return send(
        msg,
        `Type \`${
          options.prefix
        }user <username>\` to see a user's history of using hate speech.`
      )
    if (!user)
      return send(
        msg,
        `\`\`\`Sorry, I couldn't find a user by the name ${match[2]}.\`\`\``
      )

    const displayUsername = user ? getLabelFromUser(user) : match[2]

    const foundUserInfractions = await db.getUserInfractions({
      userId: user.id || user.user.id,
    })
    if (!foundUserInfractions || foundUserInfractions.length === 0)
      return send(
        msg,
        `\`\`\`Great news! As far as I know, ${displayUsername} has never used hate speech on a Discord server.\`\`\``
      )
    send(
      msg,
      formatInfractions({
        username: displayUsername,
        infractions: foundUserInfractions,
      })
    )
  },
}
