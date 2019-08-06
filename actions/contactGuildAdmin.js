const db = require('../db/firestore')
const { getContactOrOwnerOrModerator } = require('../commonFunctions')

module.exports = async ({ guild, options, message, msg }) => {
  options =
    options ||
    (await db.getGuildSettings({
      guildId: guild.id,
    }))
  const currentGuildContact = getContactOrOwnerOrModerator({
    guild,
    contact: options.contact,
  })

  if (!currentGuildContact)
    return console.log('Failed to find contact person in server', guild.name)
  currentGuildContact.user.send(message)
}
