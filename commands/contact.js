module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(contact|c)`, 'gi')
  },
  action(msg, options) {
    msg.channel.send(`
\`\`\`\`\`\``)
  },
}
//todo make real
