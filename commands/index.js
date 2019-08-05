const { getUserInGuildFromText } = require('../commonFunctions')

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
    // console.log(command.regex(options))
    const match = command.regex(options).exec(msg.content)
    if (match) {
      // admin check
      const isAdmin =
        msg.guild && msg.guild.owner
          ? (msg.guild.owner.id || msg.guild.owner.user.id) ===
              (sender.id || sender.user.id) ||
            (sender.id || sender.user.id) == options.contact
          : false
      if (command.admin && !isAdmin) {
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
        typedUser = getUserInGuildFromText(msg, usernameInPlainText)
      }

      // execute command
      command.action(msg, options, match, typedUser, sender, client)

      return true
    }
  }
}
