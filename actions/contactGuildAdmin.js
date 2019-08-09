const db = require('../db/firestore')
const { getContactsOrOwnerOrModerator } = require('../commonFunctions')

module.exports = async ({ guild, options, message, msg }) => {
  options =
    options ||
    (await db.getGuildSettings({
      guildId: guild.id,
    }))
  const currentGuildContacts = getContactsOrOwnerOrModerator({
    guild,
    contact: options.contact,
  })

  if (!currentGuildContacts)
    return console.log('Failed to find contact points in server', guild.name)
  currentGuildContacts.forEach(singleContact =>
    singleContact.user.send(message)
  )
}
