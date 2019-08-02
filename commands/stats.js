const db = require('../db/firestore')

module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(stats|s)`, 'gi')
  },
  async action(msg, options) {
    console.log(`${msg.guild.name} - Stats`)
    // const serverStats = await db.getGuildStats(msg.guild.id)
    const overallStats = {
      ...(await db.getOverallStats()),
      guildCount: db.getGuildCount(),
      offenderCount: db.getOverallOffenderCount(),
    }
    msg.channel.send(`**Global Stats:**
\`\`\`${overallStats.guildCount} servers running this bot
${overallStats.offenderCount} offenders across all servers
${
  overallStats.totalInfractions
} uses of hate speech caught across all servers\`\`\``)
  },
}
