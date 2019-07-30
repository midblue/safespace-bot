module.exports = {
  admin: true,
  expectsUserInRegexSlot: 2,
  regex(options) {
    return new RegExp(`^${options.prefix}(?:forgive|f)( ?)(.*)`, 'gi')
  },
  async action(msg, options, match, user) {
    if (!user && !match[2])
      return msg.channel.send(
        `Type \`${
          options.prefix
        }forgive <username>\` to forgive a user's history of using hate speech on your server.`
      )
    if (!user)
      return msg.channel.send(
        `\`\`\`Sorry, I couldn't find a user by the name ${match[2]}.\`\`\``
      )

    const displayUsername = user
      ? `${user.nickname ? user.nickname + ' (' : ''}${user.user.username}#${
          user.user.discriminator
        }${user.nickname ? ')' : ''}`
      : match[2]

    const foundUserData = await getUserData(user)

    if (
      !foundUserData ||
      !foundUserData.infractions ||
      foundUserData.infractions.length === 0
    )
      return msg.channel.send(
        `\`\`\`As far as I know, ${displayUsername} has never used hate speech on Discord.\`\`\``
      )

    const thisServerId = msg.guild.id
    const infractionsOnThisServer = foundUserData.infractions.filter(
      i => i.guildId == thisServerId
    )
    const infractionsOnOtherServers = foundUserData.infractions.filter(
      i => i.guildId != thisServerId
    )
    if (infractionsOnThisServer.length === 0)
      return msg.channel.send(
        `\`\`\`${displayUsername} has used hate speech elsewhere, but not on your server. You only have the power to forgive hate speech from your own server. Type !user ${
          match[2]
        } to see all of their infractions.\`\`\``
      )

    //todo actually remove infractions from db
    msg.channel.send(
      `\`\`\`${displayUsername} has been forgiven for using hate speech on your server ${
        infractionsOnThisServer.length
      } time${infractionsOnThisServer.length === 1 ? '' : 's'}.${
        infractionsOnOtherServers.length > 0
          ? ` ${infractionsOnOtherServers.length} infraction${
              infractionsOnOtherServers.length === 1
                ? ' on another server has'
                : 's on other servers have'
            } not been forgiven.`
          : ''
      }\`\`\``
    )
  },
}

function getUserData(user) {
  return testOffender
  //todo real data
}

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
