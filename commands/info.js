module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(i|h|info|help|guide|about)`, 'gi')
  },
  action(msg, options) {
    return msg.channel
      .send(`Welcome to the SafeSpace bot! This bot is designed to keep hate speech and hate speech users out of your server.
It will track hate speech users across any server that this bot is running on. Even if they use hate speech on another server, you will be alerted.

**Public commands:**
\`${options.prefix}info\` - show info, stats, and commands
\`${options.prefix}list\` - show all hate speech users in this server
\`${
      options.prefix
    }user <username>\` - view all instances of hate speech from a user, across all servers this bot is running on
\`${options.prefix}stats\` - see stats for the SafeSpace bot

**Admin commands:**
\`${
      options.prefix
    }add <blacklisted word>\` - add a word to the list of unacceptable terms on your server
\`${
      options.prefix
    }contact <username>\` - set the user that the bot will DM in the event of hate speech. Defaults to the server owner.
\`${options.prefix}message\` - view the current auto-reply to hate speech
\`${
      options.prefix
    }message <new message>\` - sets a new auto-reply to hate speech
\`${
      options.prefix
    }forgive <username>\` - forgive a user for all past (not future) hate speech on this server
    
For feedback and bug reports, check us out on github!`)
    // todo real link to gh
  },
}
