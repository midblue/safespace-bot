module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(?:u|user)( ?)(.*)`, 'gi')
  },
  async action(msg, options, match) {
    const username = match[1] && match[2]
    if (!username)
      return msg.channel.send(
        `Type \`${
          options.prefix
        }user <username>\` to see a user's history of using hate speech.`
      )
    const foundUserData = await getUserData(username)
    if (!foundUserData)
      return msg.channel.send(
        `\`Sorry, I couldn't find a user by the name ${username}.\``
      )
    if (foundUserData.infractions.length === 0)
      return msg.channel.send(
        `\`\`\`Great news! As far as I know, ${username} has never used hate speech on a Discord server.\`\`\``
      )
    msg.channel.send(`\`\`\`All logged uses of hate speech by ${username}:
-------------------------------------
${foundUserData.infractions
  .slice(0, 10)
  .map(
    u =>
      `"${u.fullMessage}"
	  - ${new Date(u.date).toLocaleDateString()} in #${u.channel} on server ${
        u.guild
      }`
  )
  .join('\n')}${
      foundUserData.infractions.length > 10
        ? `(${foundUserData.infractions.length -
            10} additional infractions not shown.)`
        : ''
    }\`\`\``)
  },
}

function getUserData(username) {
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
      guildId: '1234',
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
