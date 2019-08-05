const db = require('../db/firestore')
const { reply, send } = require('../actions/replyInChannel')

module.exports = {
  admin: true,
  regex(options) {
    return new RegExp(`^${options.prefix}(?:prefix|setprefix|p) ?(.*)`, 'gi')
  },
  async action(msg, options, match) {
    console.log(`${msg.guild.name} - Prefix`)
    const newPrefix = match[1]
    if (!newPrefix)
      return send(
        msg,
        `The current prefix is: \`${options.prefix}\`
Type \`${
          options.prefix
        }prefix <s!/s-/s~>\` to set the command prefix for this bot to one of the options listed.`
      )

    if (!['s!', 's-', 's~'].includes(newPrefix))
      return send(msg, `The bot command prefix must be either s!, s-, or s~.`)

    await db.setGuildSettings({ guildId: msg.guild.id, prefix: newPrefix })

    send(
      msg,
      `The bot command prefix been changed from \`${
        options.prefix
      }\` to \`${newPrefix}\``
    )
  },
}
