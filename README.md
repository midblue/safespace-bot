# SafeSpace, an Anti-Hate-Speech bot for Discord

**Keep hate speech OUT of your server, and everyone else's server, too.**

Update Jan 2022:
> tl;dr the public Safespace Bot is shutting down because Discord neutered it.

> Discord changed their bot rules such that seeing message contents requires special permission. I applied for this permission, and was rejected with illogical reasoning. Since this bot revolves around that, I've decided to shut down the publically hosted bot rather than continue to spend money on hosting a husk of the bot I've envisioned.

> Please be aware that I will not be actively developing the bot going forward. Feel free to fork your own versions for new features.

---

![Header image](https://www.jasperstephenson.com/posts/safespace/headerthin.png)

## This bot will

- Call out hate speech users ![](https://www.jasperstephenson.com/posts/safespace/2.png)
- Notify server admins when hate speech is used ![](https://www.jasperstephenson.com/posts/safespace/1.png)
- Notify the admins of OTHER servers this bot is running on when hate speech is used by a member of their server, even if it was used on a different server ![](https://www.jasperstephenson.com/posts/safespace/3.png)
- Notify admins when a hate speech user joins their server ![](https://www.jasperstephenson.com/posts/safespace/4.png)
- Let all server users see exactly who has used hate speech, and in what context ![](https://www.jasperstephenson.com/posts/safespace/6.png)
- Allow admins to forgive anyone for any hate speech used in their server ![](https://www.jasperstephenson.com/posts/safespace/5.png)

The beauty of this bot lies in the fact that the more servers use it, the better it gets at rooting out hate speech users across the entire Discord network.

## Forgiveness

Obviously, words have context.  
That's why any usage of a word defined as "hate speech" by this bot can be forgiven by the server admin. If the server admin forgives a user within 24 hours of the infraction, the bot will not alert the admins of any other servers that that member is in.  
We also wouldn't recommend using this bot anywhere that a blacklisted word might be used casually and without malice, such as a gay pride server.

## Commands

**Public commands:**  
`s!info` - Show info, stats, and commands.  
`s!list` - Show all hate speech users in this server.  
`s!user <username>` - View all instances of hate speech from a user, across all servers this bot is running on.  
`s!stats` - See stats for the SafeSpace bot.

**Admin commands:**  
`s!forgive <username>` - Forgive a user for all past (but not future) hate speech on this server.  
`s!contact` - View the users that the bot will DM in the event of hate speech. Defaults to the server owner.  
`s!contact <username>` - Add or remove a user for the bot to DM in the event of hate speech.  
`s!message` - View the current auto-reply to hate speech.  
`s!message <new message>` - Sets a new auto-reply to hate speech.  
`s!prefix <s!/s-/s~>` - Set the prefix for bot commands to one of these 3 options. Defaults to "s!".

## Help Out With Server Costs!
[Patreon](https://www.patreon.com/midblue)  

Paypal:  
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=EPH9CL25C3LLA)


---

If you have any questions or comments, contact jasp#8169 on Discord, or open an Issue here on Github.
