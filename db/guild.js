const defaultServerOptions = require('../defaultServerOptions')

const memoedServerSettings = {}

module.exports = function(firestore) {
  firestore
    .collection('guilds')
    .get()
    .then(snapshot => {
      console.log(snapshot.size, 'guilds found in database.')
      snapshot.forEach(el => (memoedServerSettings[el.id] = el.data()))
    })
  // .then(() => console.log(memoedServerSettings))

  return {
    getGuildCount() {
      return Object.keys(memoedServerSettings).length
      // do we want to add 10 to this or something? just for funsies ;)
    },

    async hasGuild({ guildId }) {
      const document = firestore.doc(`guilds/${guildId}`)
      const doc = await document.get()
      if (doc.data()) return true
      return false
    },

    async addGuild({ guildId, guildName, guildOwnerId }) {
      const document = firestore.doc(`guilds/${guildId}`)
      const newData = { dateAdded: Date.now(), name: guildName, contact: [] }
      if (guildOwnerId) newData.contact.push(guildOwnerId)
      await document.set(newData)
      memoedServerSettings[guildId] = newData
      console.log(`Added guild ${guildId}`)
    },

    async removeGuild({ guildId }) {
      // should be never used
      const document = firestore.doc(`guilds/${guildId}`)
      await document.delete()
      delete memoedServerSettings[guildId]
      console.log(`Removed guild ${guildId}`)
    },

    async getGuildSettings({ guildId }) {
      if (memoedServerSettings[guildId])
        return {
          ...defaultServerOptions,
          ...memoedServerSettings[guildId],
        }

      const document = firestore.doc(`guilds/${guildId}`)
      const doc = await document.get()
      return {
        ...defaultServerOptions,
        ...(doc.data() || {}),
      }
    },

    async setGuildSettings({ guildId, message, prefix, contact }) {
      const document = firestore.doc(`guilds/${guildId}`)
      const newSettings = {}
      if (message) newSettings.message = message
      if (prefix) newSettings.prefix = prefix
      if (contact) newSettings.contact = contact
      await document.update(newSettings)

      memoedServerSettings[guildId] = {
        ...memoedServerSettings[guildId],
        ...newSettings,
      }

      console.log(`Updated settings for guild ${guildId}`)
    },

    // async getGuildStats({ guildId }) {
    //   return {
    //     asdf: 'jkl',
    //   }
    // },
  }
}
