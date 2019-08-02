const db = require('../db/firestore')

module.exports = {
  admin: true,
  regex(options) {
    return new RegExp(`^${options.prefix}(?:prefix|setprefix|p) ?(.*)`, 'gi')
  },
  async action(msg, options, match) {
    console.log(`${msg.guild.name} - Prefix`)
    const newPrefix = match[1]
    if (!newPrefix)
      return msg.channel.send(
        `The current prefix is: \`${options.prefix}\`
Type \`${
          options.prefix
        }prefix <!/-/~>\` to set the command prefix for this bot to one of the options listed.`
      )

    if (!['!', '-', '~'].includes(newPrefix))
      return msg.channel.send(
        `The bot command prefix must be either !, -, or ~.`
      )

    await db.setGuildSettings({ guildId: msg.guild.id, prefix: newPrefix })

    msg.channel.send(
      `The bot command prefix been changed from \`${
        options.prefix
      }\` to \`${newPrefix}\``
    )
  },
}
