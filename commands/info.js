const db = require('../db/firestore')

module.exports = {
  regex(options) {
    return new RegExp(`^${options.prefix}(i|h|info|help|guide|about)`, 'gi')
  },
  async action(msg, options) {
    return msg.channel
      .send(`Welcome to the SafeSpace bot! This bot is designed to keep hate speech and hate speech users out of your server.
It will track hate speech users across any of the ${db.getGuildCount()} servers that this bot is running on. Even if they use hate speech on another server, you will be alerted.

**Blacklisted Words:** ${options.blacklistedWords.sanitized.join(', ')}

**Public commands:**
\`${options.prefix}info\` - Show info, stats, and commands
\`${options.prefix}list\` - Show all hate speech users in this server
\`${
      options.prefix
    }user <username>\` - View all instances of hate speech from a user, across all servers this bot is running on
\`${options.prefix}stats\` - See stats for the SafeSpace bot

**Admin commands:**
\`${
      options.prefix
    }contact\` - View the user that the bot will DM in the event of hate speech. Defaults to the server owner.
\`${
      options.prefix
    }contact <username>\` - Set the user for the bot to DM in the event of hate speech.
\`${
      options.prefix
    }prefix <!/-/~>\` - Set the prefix for bot commands to one of these 3 options. Defaults to "!".
\`${options.prefix}message\` - View the current auto-reply to hate speech
\`${
      options.prefix
    }message <new message>\` - Sets a new auto-reply to hate speech
\`${
      options.prefix
    }forgive <username>\` - Forgive a user for all past (but not future) hate speech on this server
    
For feedback and bug reports, check us out on github!`)
    // todo real link to gh

    /*

\`${
      options.prefix
    }add <blacklisted word>\` - add a word to the list of unacceptable terms on your server
\`${
      options.prefix
    }remove <blacklisted word>\` - remove a word from the list of unacceptable terms on your server

\`${options.prefix}words\` - show all blacklisted words in this server

    */
  },
}
