const scanOldMessages = require('../actions/scanOldMessages')
const { reply, send } = require('../actions/replyInChannel')

module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(forcerescan)`, 'gi')
  },
  async action(msg) {
    console.log(`${msg.guild.name} - Force Rescan`)
    send(
      msg,
      `Initializing a full server rescan. This may take some time. There will not be any indiication that it's working.`
    )
    scanOldMessages(msg.guild)
  },
}
