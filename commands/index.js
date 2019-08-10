const { getUserInGuildFromText } = require('../commonFunctions')
const { reply, send } = require('../actions/replyInChannel')

// get all commands from files
const fs = require('fs')
const commands = []
fs.readdir('./commands', (err, files) => {
  files.forEach(file => {
    if (!file.endsWith('.js') || file === 'index.js') return
    commands.push(require(`./${file}`))
  })
})

module.exports = function(msg, options, client) {
  const sender = msg.author
  for (let command of commands) {
    // console.log(command.regex(options), msg.content)
    const match = command.regex(options).exec(msg.content)
    if (match) {
      // admin check
      const isAdmin =
        msg.guild &&
        msg.guild.member(msg.author).permissions.has('ADMINISTRATOR')
      if (command.admin && !isAdmin) {
        send(msg, `This command is only available to the server admin.`)
        return true
      }

      // embedded user check
      let typedUser = null
      if (
        command.expectsUserInRegexSlot &&
        match[command.expectsUserInRegexSlot - 1]
      ) {
        const usernameInPlainText = match[command.expectsUserInRegexSlot]
        typedUser = getUserInGuildFromText(msg, usernameInPlainText)
      }

      // execute command
      command.action(msg, options, match, typedUser, sender, client)

      return true
    }
  }
}
