const db = require('./db/firestore')

module.exports = {
  getUserInGuildFromText(msg, searchText) {
    if (searchText.length < 2) return
    const usersInGuild = msg.guild.members.array()
    const userNamesInGuild = usersInGuild.map(user => ({
      ...user,
      searchString: `${user.user.username} ${user.user.username}#${
        user.user.discriminator
      } ${user.nickname ? user.nickname : ''} <@!${user.id}>`.toLowerCase(),
    }))
    const foundUser = userNamesInGuild.find(
      userName => userName.searchString.indexOf(searchText.toLowerCase()) >= 0
    )
    return foundUser
  },

  async getAllOffendersInGuild(guild) {
    const memberIds = guild.members.array().map(m => m.id || m.user.id)
    return await db.getAllMemberInfractions({ memberIds })
  },

  getUserInGuildFromId,

  getContactsOrOwnerOrModerator({ guild, contact }) {
    // backwards compatible with old single contact method
    if (contact && !Array.isArray(contact)) contact = [contact]
    // default to contact list
    let thePeople = contact
      ? contact
          .map(singleContact => getUserInGuildFromId(guild, singleContact))
          .filter(c => c)
      : false
    if (thePeople && thePeople.length > 0) return thePeople
    // check guild.owner
    thePeople = getUserInGuildFromId(guild, guild.ownerID)
    if (thePeople) return [thePeople]
    // at this point, we just look for an admin of any kind
    thePeople = guild.members
      .array()
      .filter(member => member.permissions.has('ADMINISTRATOR'))
    if (thePeople && thePeople.length > 0) return thePeople
    return []
  },

  getLabelFromUser(user) {
    if (!user) return
    return `${user.nickname ? user.nickname + ' (' : ''}${user.username ||
      user.user.username}#${user.discriminator || user.user.discriminator}${
      user.nickname ? ')' : ''
    }`
  },

  formatInfractions({ username, infractions }) {
    return `\`\`\`All logged uses of hate speech by ${username}:

${infractions
  .slice(0, 10)
  .map(
    u =>
      `"${u.fullMessage}"
	  - ${u.date.toDate().toLocaleDateString()} in #${u.channel} on server ${
        u.guild
      }`
  )
  .join('\n')}${
      infractions.length > 10
        ? `

(${infractions.length - 10} additional infractions not shown.)`
        : ''
    }\`\`\``
  },
}

function getUserInGuildFromId(guild, id) {
  if (!guild || !id) return
  const usersInGuild = guild.members.array()
  return usersInGuild.find(user => (user.id || user.user.id) == id)
}
