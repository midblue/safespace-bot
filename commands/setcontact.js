const db = require('../db/firestore')
const {
  getContactOrOwnerOrModerator,
  getLabelFromUser,
} = require('../commonFunctions')
const { reply, send } = require('../actions/replyInChannel')

module.exports = {
  admin: true,
  expectsUserInRegexSlot: 2,
  regex(options) {
    return new RegExp(
      `^${options.prefix}(?:contact|c|setcontact)( ?)(.*)`,
      'gi'
    )
  },
  async action(msg, options, match, user) {
    console.log(`${msg.guild.name} - Contact`)
    const currentContact = getContactOrOwnerOrModerator({
      guild: msg.guild,
      contact: options.contact,
    })
    if (!user && !match[2])
      return send(
        msg,
        `The current contact for when hate speech is used on your server is ${getLabelFromUser(
          currentContact
        )}.
Type \`${options.prefix}contact <username>\` to set a new contact.`
      )
    if (!user)
      return send(
        msg,
        `\`\`\`Sorry, I couldn't find a user by the name ${match[2]}.\`\`\``
      )

    await db.setGuildSettings({
      guildId: msg.guild.id,
      contact: user.id || user.user.id,
    })

    send(
      msg,
      `The contact for when hate speech is used on your server has been changed from ${getLabelFromUser(
        currentContact
      )} to ${getLabelFromUser(user)}`
    )
  },
}
