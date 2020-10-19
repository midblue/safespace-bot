const db = require('./db/firestore')

module.exports = {
  async getUserInGuildFromText(msg, searchText) {
    if (searchText.length < 2) return
    // todo check for @names too
    const usersInGuild = await getGuildMembers({ msg })
    const userNamesInGuild = usersInGuild.map(user => ({
      ...user,
      searchString: `${user.user.username} ${user.user.username}#${
        user.user.discriminator
      } ${user.nickname ? user.nickname : ''} <@!${user.id}> <@${
        user.id
      }>`.toLowerCase(),
    }))
    const foundUser = userNamesInGuild.find(
      userName => userName.searchString.indexOf(searchText.toLowerCase()) >= 0,
    )
    return foundUser
  },

  async getAllOffendersInGuild(guild) {
    const memberIds = (await guild.members.cache.array()).map(
      m => m.id || m.user.id,
    )
    return await db.getAllMemberInfractions({ memberIds })
  },

  getUserInGuildFromId,

  async getContactsOrOwnerOrModerator({ guild, contact }) {
    // backwards compatible with old single contact method
    if (contact && !Array.isArray(contact)) contact = [contact]
    // default to contact list
    let thePeople = contact
      ? contact.map(
          async singleContact =>
            await getUserInGuildFromId(guild, singleContact),
        )
      : []
    thePeople = await Promise.all(thePeople)
    thePeople = thePeople.filter(c => c)
    if (thePeople.length > 0) return thePeople
    // check guild.owner
    thePeople = await getUserInGuildFromId(guild, guild.ownerID)
    if (thePeople) return [thePeople]
    // at this point, we just look for an admin of any kind
    thePeople = (await getGuildMembers({ guild })).filter(member =>
      member.permissions.has('ADMINISTRATOR'),
    )
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
    const shownLimit = 20
    return `\`\`\`All logged uses of hate speech by ${username}:

${infractions
  .slice(0, shownLimit)
  .map(
    u =>
      `"${u.fullMessage}"
	  - ${u.date.toDate().toLocaleDateString()} in #${u.channel} on server ${
        u.guild
      }`,
  )
  .join('\n')}${
      infractions.length > shownLimit
        ? `

(${infractions.length - shownLimit} additional infractions not shown.)`
        : ''
    }\`\`\``
  },
}

async function getUserInGuildFromId(guild, id) {
  if (!guild || !id) return
  const usersInGuild = await getGuildMembers({ guild, ids: [id] })
  return usersInGuild.find(user => user.user.id == id)
}

async function getGuildMembers({ msg, guild, ids }) {
  if (msg) guild = msg.guild
  let members = []
  if (!ids) {
    // just get everything
    try {
      members = (
        await guild.members.fetch().catch(e => {
          console.log(e)
          return
        })
      ).array()
    } catch (e) {
      members = guild.members.cache.array()
      console.log(
        `failed to get ${members.length} guild members, falling back to cache`,
      )
    }
  }
  // get specific ids
  else members = await guild.members.fetch({ user: ids })

  return members
}
