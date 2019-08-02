# SafeSpace, an Anti-Hate-Speech bot for Discord
**Keep hate speech OUT of your server, and everyone else's server, too.**

### [Add SafeSpace to your server now!](https://discordapp.com/oauth2/authorize?client_id=605039242309140483&scope=bot&permissions=68608)

---

## This bot will
- Call out hate speech users
- Notify server admins when hate speech is used
- Notify admins of OTHER servers this bot is running on when hate speech is used by a member of their server, even if it was used on a different server
- Notify admins when a hate speech user joins their server
- Let all server users see exactly who has used hate speech, and in what context
- Allow admins to forgive anyone for any hate speech used in their server

The beauty of this bot lies in the fact that the more servers use it, the better it gets at rooting out hate speech users across the entire Discord network.

## Blacklisted Words
`n****r`, `f*g`, `f****t`, `s**c`, `k**e`, `w*****k` and their plural forms.

## Forgiveness
Obviously, words have context.  
That's why any usage of a word defined as "hate speech" by this bot can be forgiven by the server admin. If the server admin forgives a user within 24 hours of the infraction, the bot will not alert the admins of any other servers that that member is in.

## Commands
**Public commands:**  
`s!info` - Show info, stats, and commands.  
`s!list` - Show all hate speech users in this server.  
`s!user <username>` - View all instances of hate speech from a user, across all servers this bot is running on.  
`s!stats` - See stats for the SafeSpace bot.  

**Admin commands:**  
`s!forgive <username>` - Forgive a user for all past (but not future) hate speech on this server.  
`s!contact` - View the user that the bot will DM in the event of hate speech. Defaults to the server owner.  
`s!contact <username>` - Set the user for the bot to DM in the event of hate speech.  
`s!message` - View the current auto-reply to hate speech.  
`s!message <new message>` - Sets a new auto-reply to hate speech.  
`s!prefix <s!/s-/s~>` - Set the prefix for bot commands to one of these 3 options. Defaults to "s!".  

---
If you have any questions or comments, contact jasp#8169 on Discord, or open an Issue here on Github.