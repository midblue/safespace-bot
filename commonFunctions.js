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

  getContactOrOwnerOrModerator({ guild, contact, msg }) {
    // default to contact person, then check guild.owner, then try to get the owner by ID
    let thePerson =
      (contact
        ? getUserInGuildFromId(guild, contact) || guild.owner
        : guild.owner) || getUserInGuildFromId(guild, guild.ownerID)
    if (thePerson) return thePerson
    // if that didn't work and we don't know what channel we're in, we're SOL
    if (!msg) return
    // at this point, we just look for an admin of any kind
    thePerson = guild.members
      .array()
      .find(member => member.permissions.has('ADMINISTRATOR'))
    return thePerson
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
