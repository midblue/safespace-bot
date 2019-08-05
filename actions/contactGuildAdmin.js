const db = require('../db/firestore')
const { getUserInGuildFromId } = require('../commonFunctions')

module.exports = async ({ guild, options, message }) => {
  options =
    options ||
    (await db.getGuildSettings({
      guildId: guild.id,
    }))
  const currentGuildContact =
    (options.contact
      ? getUserInGuildFromId(guild, options.contact) || guild.owner
      : guild.owner) || getUserInGuildFromId(guild, guild.ownerID)
  if (!currentGuildContact)
    return console.log('Failed to find contact person in server', guild.name)
  currentGuildContact.user.send(message)
}
