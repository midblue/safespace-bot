const db = require('../db/firestore')
const { reply, send } = require('../actions/replyInChannel')

module.exports = {
  admin: true,
  regex(options) {
    return new RegExp(
      `^${options.prefix}(?:message|setmessage|m)( ?)([\\w\\W]*)$`,
      'gi'
    )
  },
  async action(msg, options, match) {
    console.log(`${msg.guild.name} - Message`)
    const newMessage = match[2]
    if (!newMessage || !match[1])
      return send(
        msg,
        `The current auto-reply to hate speech is: \`\`\`${
          options.message
        }\`\`\`
Type \`${
          options.prefix
        }message <new message>\` to set a new auto-reply to hate speech (multiple line messages are fine!)`
      )

    await db.setGuildSettings({ guildId: msg.guild.id, message: newMessage })

    send(
      msg,
      `The auto-reply to hate speech has been changed from:
\`\`\`${options.message}\`\`\`
to:
\`\`\`
${newMessage}\`\`\``
    )
  },
}
