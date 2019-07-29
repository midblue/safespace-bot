const testOffender = {
  id: '12345',
  username: 'test1',
  displayName: 'racist bill',
  infractions: [
    {
      date: Date.now(),
      guild: 'demo guildname',
      guildId: '605053799404666880',
      channel: 'general',
      fullMessage: `those nwords`,
      words: ['nword'],
    },
    {
      date: Date.now(),
      guild: 'demo guildname 2',
      guildId: '1234',
      channel: 'general',
      fullMessage: `you fword nword`,
      words: ['fword nword'],
    },
  ],
}

module.exports = {
  admin: true,
  regex(options) {
    return new RegExp(`^${options.prefix}(?:f|forgive)( ?)(.*)`, 'gi')
  },
  async action(msg, options, match) {
    const username = match[1] && match[2]
    if (!username)
      return msg.channel.send(
        `Type \`${
          options.prefix
        }forgive <username>\` to forgive a user's history of using hate speech on your server.`
      )

    const foundUserData = await getUserData(username)
    if (!foundUserData)
      return msg.channel.send(
        `\`Sorry, I couldn't find a user by the name ${username}.\``
      )

    if (foundUserData.infractions.length === 0)
      return msg.channel.send(
        `\`\`\`As far as I know, ${username} has never used hate speech on Discord.\`\`\``
      )

    const thisServerId = msg.guild.id
    console.log(thisServerId)
    const infractionsOnThisServer = foundUserData.infractions.filter(
      i => i.guildId == thisServerId
    )
    const infractionsOnOtherServers = foundUserData.infractions.filter(
      i => i.guildId != thisServerId
    )
    if (infractionsOnThisServer.length === 0)
      return msg.channel.send(
        `\`\`\`${username} has used hate speech elsewhere, but not on your server. You only have the power to forgive hate speech from your own server.\`\`\``
      )

    msg.channel.send(
      `\`\`\`${username} has been forgiven for using hate speech on your server ${
        infractionsOnThisServer.length
      } time${infractionsOnThisServer.length === 1 ? '' : 's'}.${
        infractionsOnOtherServers.length > 0
          ? ` ${infractionsOnOtherServers.length} infraction${
              infractionsOnOtherServers.length === 1
                ? ' on another server has'
                : 's on other servers have'
            } not been cleared.`
          : ''
      }\`\`\``
    )
  },
}

function getUserData(username) {
  return testOffender
  //todo real data
}
