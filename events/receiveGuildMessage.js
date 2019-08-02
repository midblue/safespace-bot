const db = require('../db/firestore')
const commands = require('../commands/index')

module.exports = async (msg, client) => {
  commands(msg, await db.getGuildSettings({ guildId: msg.guild.id }), client)
}
