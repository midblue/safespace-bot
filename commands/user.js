const db = require('../db/firestore')
const { getLabelFromUser } = require('../commonFunctions')

module.exports = {
  expectsUserInRegexSlot: 2,
  regex(options) {
    return new RegExp(`^${options.prefix}(?:user|u)( ?)(.*)`, 'gi')
  },
  async action(msg, options, match, user) {
    if (!user && !match[2])
      return msg.channel.send(
        `Type \`${
          options.prefix
        }user <username>\` to see a user's history of using hate speech.`
      )
    if (!user)
      return msg.channel.send(
        `\`\`\`Sorry, I couldn't find a user by the name ${match[2]}.\`\`\``
      )

    const displayUsername = user ? getLabelFromUser(user) : match[2]

    const foundUserInfractions = await db.getUserInfractions({
      userId: user.id || user.user.id,
    })
    if (!foundUserInfractions || foundUserInfractions.length === 0)
      return msg.channel.send(
        `\`\`\`Great news! As far as I know, ${displayUsername} has never used hate speech on a Discord server.\`\`\``
      )
    msg.channel
      .send(`\`\`\`All logged uses of hate speech by ${displayUsername}:

${foundUserInfractions
  .slice(0, 10)
  .map(
    u =>
      `"${u.fullMessage}"
	  - ${new Date(u.date).toLocaleDateString()} in #${u.channel} on server ${
        u.guild
      }`
  )
  .join('\n')}${
      foundUserInfractions.length > 10
        ? `(${foundUserInfractions.length -
            10} additional infractions not shown.)`
        : ''
    }\`\`\``)
  },
}
