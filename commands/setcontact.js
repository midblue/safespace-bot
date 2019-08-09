const db = require('../db/firestore')
const {
  getContactsOrOwnerOrModerator,
  getUserInGuildFromId,
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
    const currentSettings = await db.getGuildSettings({
      guildId: msg.guild.id,
    })
    let currentContacts = currentSettings.contact || []
    if (!Array.isArray(currentContacts)) currentContacts = [currentContacts]
    currentContacts = currentContacts
      .map(contact => getUserInGuildFromId(msg.guild, contact))
      .filter(c => c)

    // getContactsOrOwnerOrModerator({
    //   guild: msg.guild,
    //   contact: options.contact,
    // }) || []
    console.log(currentContacts.length)

    // no user, just list
    if (!user && !match[2])
      return send(
        msg,
        (currentContacts.length > 0
          ? `The current contacts for when hate speech is used on your server are:
\`\`\`${currentContacts.map(contact => getLabelFromUser(contact)).join(`
`)}\`\`\``
          : `Currently, there are no contacts for when hate speech is used on your server.`) +
          `
Type \`${
            options.prefix
          }contact <username>\` to add a new contact, or to remove them from the list.`
      )

    // user not found
    if (!user)
      return send(
        msg,
        `\`\`\`Sorry, I couldn't find a user by the name ${match[2]}.\`\`\``
      )

    const foundUserInList = currentContacts.find(
      contact => (contact.id || contact.user.id) === (user.id || user.user.id)
    )

    //delete from list
    if (foundUserInList) {
      const filteredList = currentContacts.filter(
        contact => (contact.id || contact.user.id) !== (user.id || user.user.id)
      )

      await db.setGuildSettings({
        guildId: msg.guild.id,
        contact: filteredList.map(user => user.id || user.user.id),
      })

      send(
        msg,
        `Removed ${getLabelFromUser(foundUserInList)} from the contact list. ` +
          (filteredList.length === 0
            ? `There are no users left in the list.`
            : `The new list is:
\`\`\`${filteredList.map(contact => getLabelFromUser(contact)).join(`
`)}\`\`\``)
      )
    }

    // add to list
    else {
      const addedList = [...currentContacts, user]

      await db.setGuildSettings({
        guildId: msg.guild.id,
        contact: addedList.map(user => user.id || user.user.id),
      })

      send(
        msg,
        `Added ${getLabelFromUser(user)} to the contact list. ` +
          (addedList.length === 0
            ? `There are no users left in the list.`
            : `The new list is:
\`\`\`${addedList.map(contact => getLabelFromUser(contact)).join(`
`)}\`\`\``)
      )
    }
  },
}
