const db = require('../db/firestore')

module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(stats|s)`, 'gi')
  },
  async action(msg, options) {
    const serverStats = await db.getGuildStats(msg.guild.id)
    const overallStats = {
      ...(await db.getOverallStats()),
      guildCount: db.getGuildCount(),
      offenderCount: db.getOverallOffenderCount(),
    }
    msg.channel.send(`**Server Stats:**
\`\`\`${JSON.stringify(serverStats, 1, 1)}\`\`\`
**Global Stats:**
\`\`\`${overallStats.guildCount} servers running this bot
${overallStats.offenderCount} offenders across all servers
${
  overallStats.totalInfractions
} uses of hate speech caught across all servers\`\`\``)
  },
}
