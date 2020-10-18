const db = require('../db/firestore')
const {
  getContactsOrOwnerOrModerator,
  getLabelFromUser,
} = require('../commonFunctions')

// todo rate limit these! 55 in a row one time...

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
    singleContact.user.send(message.substring(0, 1999)).catch(err => {
      console.log(
        `Failed to contact admin ${getLabelFromUser(singleContact)}: ${
          err.message
        }`,
      )
    }),
  )
}
