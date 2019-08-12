const db = require('../db/firestore')
const { reply, send } = require('../actions/replyInChannel')

module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(stats|s)`, 'gi')
  },
  async action(msg, options) {
    console.log(`${msg.guild.name} - Stats`)
    // const serverStats = await db.getGuildStats(msg.guild.id)
    const overallStats = {
      ...(await db.getOverallStats()),
      guildCount: await db.getGuildCount(),
      offenderCount: await db.getOverallOffenderCount(),
    }
    send(
      msg,
      `**Global Stats:**
\`\`\`${overallStats.guildCount || 0} servers running this bot
${overallStats.offenderCount || 0} offenders across all servers
${overallStats.totalInfractions ||
  0} uses of hate speech caught across all servers
${overallStats.totalMessagesScanned || 0} messages scanned\`\`\``
    )
  },
}
