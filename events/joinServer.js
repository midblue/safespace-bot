const db = require('../db/firestore')

module.exports = guild => {
  db.addGuild({
    guildId: guild.id,
    guildName: guild.name,
  })
  //todo test
  console.log('Was added to a new guild: ' + guild.name)
}
