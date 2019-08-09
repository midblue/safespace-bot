const db = require('../db/firestore')
const defaultOptions = require('../defaultServerOptions')
const { reply, send } = require('../actions/replyInChannel')

module.exports = {
  regex(options) {
    return new RegExp(
      `^(?:${options.prefix}|!|s!)(i|h|info|help|guide|about)`,
      'gi'
    )
  },
  async action(msg, options) {
    console.log(`${msg.guild ? msg.guild.name : 'PM'} - Info`)
    options = options || defaultOptions
    // todo make this a nice rich message object
    return send(
      msg,
      `Hi! I'm the SafeSpace bot. I'm designed to keep hate speech and hate speech users out of your server.
I'll track hate speech users across any of the ${db.getGuildCount()} servers that I'm running on. Even if someone in your server uses hate speech on another server, you will be alerted.

**Blacklisted Words:** ${options.blacklistedWords.sanitized.join(', ')}

**Public commands:**
\`${options.prefix}info\` - Show info, stats, and commands.
\`${options.prefix}list\` - Show all hate speech users in this server.
\`${
        options.prefix
      }user <username>\` - View all instances of hate speech from a user, across all servers this bot is running on.
\`${options.prefix}stats\` - See stats for the SafeSpace bot.

**Admin commands:**
\`${
        options.prefix
      }forgive <username>\` - Forgive a user for all past (but not future) hate speech on this server.
\`${
        options.prefix
      }contact\` - View the users that the bot will DM in the event of hate speech. Defaults to the server owner.
\`${
        options.prefix
      }contact <username>\` - Add or remove a user for the bot to DM in the event of hate speech.
\`${
        options.prefix
      }message <new message>\` - Sets a new auto-reply to hate speech.
\`${
        options.prefix
      }prefix <s!/s-/s~>\` - Set the prefix for bot commands to one of these 3 options. Defaults to "s!".
\`${options.prefix}message\` - View the current auto-reply to hate speech.

Made by jasp#8169.
Go to https://github.com/midblue/safespace-bot for feedback and bug reports!`
    )

    /*
\`${
      options.prefix
    }prefix <!/-/~>\` - Set the prefix for bot commands to one of these 3 options. Defaults to "!".
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
