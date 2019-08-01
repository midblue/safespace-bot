const db = require('../db/firestore')

module.exports = async msg => {
  commands(msg, await db.getGuildSettings({ guildId: msg.guild.id }))
}
