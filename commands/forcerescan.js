const scanOldMessages = require('../actions/scanOldMessages')

module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(forcerescan)`, 'gi')
  },
  async action(msg, options) {
    console.log(`${msg.guild.name} - Force Rescan`)
    msg.channel.send(
      `Initializing a full server rescan. This may take some time. There will not be any indiication that it's working.`
    )
    scanOldMessages(msg.guild)
  },
}
