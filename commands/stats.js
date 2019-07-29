module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(s|stats)`, 'gi')
  },
  action(msg, options) {
    const serverStats = getServerStats(msg.guild.id)
    return msg.channel.send(`**Server Stats:**
\`\`\`${JSON.stringify(serverStats, 1, 1)}\`\`\`
**Global Stats:**
\`\`\`${JSON.stringify(serverStats, 1, 1)}\`\`\``)
  },
}

function getServerStats(serverId) {
  return testServer //[]
  // todo real data
}

const testServer = {
  runningSince: Date.now(),
  infractions: 5,
  forgiven: 2,
  bannedWords: ['nword', 'fword'],
}
