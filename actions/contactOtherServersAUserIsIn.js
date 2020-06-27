const db = require('../db/firestore')
const contactGuildAdmin = require('./contactGuildAdmin')

// We give a delay here just in case there really was an error:
// If the user isn't forgiven in this span, it notifies other servers they're in.
const forgiveDelay = 12 * 60 * 60 * 1000 // 1/2 day
module.exports = ({
  user,
  sourceGuildId,
  message,
  client,
  infractionMessageId,
}) => {
  const otherGuildsOffenderIsIn = client.guilds
    .array()
    .filter(
      guild =>
        guild.id !== sourceGuildId &&
        guild.members.find(
          member => (member.id || member.user.id) == (user.id || user.user.id),
        ),
    )
    .map(otherGuildOffenderIsIn => {
      setTimeout(async () => {
        const existingInfractions = await db.getUserInfractions({
          userId: user.id || user.user.id,
        })
        if (
          existingInfractions.find(
            oldInfraction => oldInfraction.messageId == infractionMessageId,
          )
        ) {
          console.log(
            `Contacting ${otherGuildOffenderIsIn.name} about infraction on another guild`,
          )
          contactGuildAdmin({
            guild: otherGuildOffenderIsIn,
            message: `${message}This user is in your server \`${otherGuildOffenderIsIn.name}\`.`,
          })
          db.incrementOtherServerContactEvents()
        }
      }, forgiveDelay)
      return otherGuildOffenderIsIn
    })
  if (otherGuildsOffenderIsIn.length > 0)
    console.log(
      `Offender found in ${
        otherGuildsOffenderIsIn.length
      } other guilds. Contacting admins of those guilds in ${
        forgiveDelay / 60 / 60 / 1000
      } hours.`,
    )
}
