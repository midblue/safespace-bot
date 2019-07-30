// get all commands from files
const fs = require('fs')
const commands = []
fs.readdir('./commands', (err, files) => {
  files.forEach(file => {
    if (!file.endsWith('.js') || file === 'index.js') return
    commands.push(require(`./${file}`))
  })
})

module.exports = function(msg, options) {
  const sender = msg.author
  for (let command of commands) {
    // console.log(command.regex(options))
    const match = command.regex(options).exec(msg.content)
    if (match) {
      // admin check
      if (command.admin && msg.guild.owner != msg.author.id) {
        msg.channel.send(`This command is only available to the server admin.`)
        return true
      }

      // embedded user check
      let typedUser = null
      if (
        command.expectsUserInRegexSlot &&
        match[command.expectsUserInRegexSlot - 1]
      ) {
        const usernameInPlainText = match[command.expectsUserInRegexSlot]
        typedUser = getUserInServerFromText(msg, usernameInPlainText)
      }

      // execute command
      command.action(msg, options, match, typedUser, sender)

      return true
    }
  }
}

function getUserInServerFromText(msg, searchText) {
  const usersInServer = msg.guild.members.array()
  const userNamesInServer = usersInServer.map(user => ({
    ...user,
    searchString: `${user.user.username} ${user.user.username}#${
      user.user.discriminator
    } ${user.nickname ? user.nickname : ''} <@!${user.id}>`.toLowerCase(),
  }))
  const foundUser = userNamesInServer.find(
    userName => userName.searchString.indexOf(searchText.toLowerCase()) >= 0
  )
  return foundUser
}
