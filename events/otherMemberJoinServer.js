const db = require('../db/firestore')
const contactGuildAdmin = require('../actions/contactGuildAdmin')
const { getLabelFromUser, formatInfractions } = require('../commonFunctions')

module.exports = async member => {
  const infractions = await db.getUserInfractions({
    userId: member.id || member.user.id,
  })
  if (!infractions || infractions.length === 0) return

  console.log(`${member.guild.name} - New User with a History`)
  const displayName = getLabelFromUser(member)
  const guild = member.guild
  contactGuildAdmin({
    guild,
    message: `A user named ${displayName} just joined your server. They have a history of using hate speech on other servers, and I thought you should know.
${formatInfractions({
  username: displayName,
  infractions,
})}`,
  })
}
