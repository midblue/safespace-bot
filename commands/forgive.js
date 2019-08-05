const db = require('../db/firestore')
const { getLabelFromUser } = require('../commonFunctions')
const { reply, send } = require('../actions/replyInChannel')

module.exports = {
  admin: true,
  expectsUserInRegexSlot: 2,
  regex(options) {
    return new RegExp(`^${options.prefix}(?:forgive|f)( ?)(.*)`, 'gi')
  },
  async action(msg, options, match, user) {
    console.log(`${msg.guild.name} - Forgive`)
    if (!user && !match[2])
      return send(
        msg,
        `Type \`${
          options.prefix
        }forgive <username>\` to forgive a user's history of using hate speech on your server.`
      )
    if (!user)
      return send(
        msg,
        `\`\`\`Sorry, I couldn't find a user by the name ${match[2]}.\`\`\``
      )

    const displayUsername = user ? getLabelFromUser(user) : match[2]

    const {
      forgivenInfractions,
      remainingInfractions,
    } = await forgiveInfractions(user, msg.guild)

    if (forgivenInfractions.length === 0 && remainingInfractions.length === 0)
      return send(
        msg,
        `\`\`\`As far as I know, ${displayUsername} has never used hate speech on Discord.\`\`\``
      )

    if (forgivenInfractions.length === 0)
      return send(
        msg,
        `\`\`\`${displayUsername} has used hate speech elsewhere, but not on your server. You only have the power to forgive hate speech from your own server.
Type !user ${match[2]} to see all of their infractions.\`\`\``
      )

    send(
      msg,
      `\`\`\`${displayUsername} has been forgiven for using hate speech on your server ${
        forgivenInfractions.length
      } time${forgivenInfractions.length === 1 ? '' : 's'}.${
        remainingInfractions.length > 0
          ? ` ${remainingInfractions.length} infraction${
              remainingInfractions.length === 1
                ? ' from another server has'
                : 's from other servers have'
            } not been forgiven.`
          : ''
      }\`\`\``
    )
  },
}

async function forgiveInfractions(user, guild) {
  return await db.forgiveUserOnServer({
    userId: user.id || user.user.id,
    guildId: guild.id,
  })
}
