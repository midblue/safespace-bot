const infoCommand = require('../commands/info')
const defaultOptions = require('../defaultServerOptions')

module.exports = async msg => {
  const infoMatch = infoCommand.regex(defaultOptions).exec(msg.content)
  if (infoMatch) {
    infoCommand.action(msg)
    msg.channel.send(`I only work in a server channel for now.`)
  } else msg.channel.send(`Type \`!info\` for commands and more.`)
  // todo make more commands work
}
