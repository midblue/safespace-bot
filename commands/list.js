module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(l|list|narc|offenders)`, 'gi')
  },
  action(msg, options) {
    const offendersInServer = getAllOffendersInServer(msg.guild.id)
    if (offendersInServer.length === 0)
      return msg.channel.send(
        `\`\`\`Great news! There are no hate speech users in this server.\`\`\``
      )
    msg.channel.send(`\`\`\`All hate speech users in this server:
-------------------------------------
${offendersInServer
  .filter(o => o.infractions.length > 0)
  .map(
    o =>
      `${o.displayName} (${o.username}) has used hate speech ${
        o.infractions.length
      } time${o.infractions.length === 1 ? '' : 's'}.`
  )
  .join('\n')}

Type ${options.prefix}user <username> to learn more about any user.\`\`\``)
  },
}

function getAllOffendersInServer(serverId) {
  return testOffenders //[]
  //todo real data
}

const testOffenders = [
  {
    id: '12345',
    username: 'test1',
    displayName: 'racist bill',
    infractions: [
      {
        date: Date.now(),
        guild: 'demo guildname',
        channel: 'general',
        fullMessage: `those nwords`,
        words: ['nword'],
      },
      {
        date: Date.now(),
        guild: 'demo guildname 2',
        channel: 'general',
        fullMessage: `you fword nword`,
        words: ['fword nword'],
      },
    ],
  },
  {
    id: '12345',
    username: 'test2',
    displayName: 'racist joe',
    infractions: [
      {
        date: Date.now(),
        guild: 'demo guildname',
        channel: 'general',
        fullMessage: `those nwords`,
        words: ['nword'],
      },
    ],
  },
]
