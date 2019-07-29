module.exports = {
  admin: true,
  regex(options) {
    return new RegExp(`^${options.prefix}(?:m|message|setmessage) ?(.*)`, 'gi')
  },
  action(msg, options, match) {
    const newMessage = match[1]
    if (!newMessage)
      return msg.channel.send(
        `The current auto-reply to hate speech is: \`\`\`@(username), ${
          options.calloutMessage
        }\`\`\`
Type \`${
          options.prefix
        }setmessage <new message>\` to set a new auto-reply to hate speech.`
      )

    // todo set new auto-reply
    msg.channel.send(
      `The auto-reply to hate speech has been changed from:
\`\`\`@(username), ${options.calloutMessage}\`\`\`
to:
\`\`\`@(username), ${newMessage}\`\`\``
    )
  },
}
