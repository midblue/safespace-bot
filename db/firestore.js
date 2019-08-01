const { Firestore } = require('@google-cloud/firestore')
const firestore = new Firestore()
const guild = require('./guild')(firestore)
const overall = require('./overall')(firestore)

const memoedOffenderUserIds = new Set()
firestore
  .collection('users')
  .get()
  .then(snapshot => {
    console.log(snapshot.size, 'offenders found in database.')
    snapshot.forEach(el => memoedOffenderUserIds.add(el.id))
  })

module.exports = {
  async addInfraction({ userId, infraction }) {
    if (!userId || !infraction)
      return console.log('invalid data to addInfraction!', userId, infraction)

    const document = firestore.doc(`users/${userId}`)
    const doc = await document.get()
    const data = doc.data() || {}
    const existingInfractions = data.infractions || []
    await document.update({
      infractions: [...existingInfractions, infraction],
    })

    memoedOffenderUserIds.add(userId)

    console.log(`Added new infraction for user ${userId}`)
    updateMasterStats({ infractions: 1 })
  },

  async forgiveUserOnServer({ userId, guildId }) {
    if (!userId || !guildId)
      return console.log('invalid data to getInfractions!', userId, guildId)

    const document = firestore.doc(`users/${userId}`)
    const doc = await document.get()
    const data = doc.data() || {}
    const existingInfractions = data.infractions || []
    const forgivenInfractions = existingInfractions.filter(
      i => i.guildId == guildId
    )
    const remainingInfractions = existingInfractions.filter(
      i => i.guildId != guildId
    )
    if (forgivenInfractions.length > 0) {
      await document.update({
        infractions: remainingInfractions,
      })
      console.log(
        `Forgave ${
          forgivenInfractions.length
        } infractions on server ${guildId} for user ${userId}`
      )
      updateMasterStats({ forgiven: 1 })
    }
    if (existingInfractions.length === 0) memoedOffenderUserIds.delete(userId)

    return { forgivenInfractions, remainingInfractions }
  },

  async getUserInfractions({ userId }) {
    if (!userId) return console.log('invalid data to getInfractions!', userId)

    if (!memoedOffenderUserIds.has(userId)) return []

    const document = firestore.doc(`users/${userId}`)
    const doc = await document.get()
    const data = doc.data() || {}
    const existingInfractions = data.infractions || []
    return existingInfractions
  },

  async getAllMemberInfractions({ memberIds }) {
    if (!memberIds)
      return console.log('invalid data to getInfractions!', memberIds)

    const promises = memberIds
      .filter(userId => memoedOffenderUserIds.has(userId))
      .map(
        userId =>
          new Promise(async resolve => {
            const document = firestore.doc(`users/${userId}`)
            const doc = await document.get()
            const data = doc.data() || {}
            const infractionsCount = data.infractions
              ? data.infractions.length
              : 0
            resolve({ userId, infractionsCount })
          })
      )
    return await Promise.all(promises)
  },

  getOverallOffenderCount() {
    return memoedOffenderUserIds.size
  },

  ...guild,

  ...overall,
}

async function updateMasterStats({ infractions, forgiven }) {
  const document = firestore.doc(`master/stats`)
  const doc = await document.get()
  const stats = doc.data() || {}
  if (!stats.totalInfractions || !stats.totalForgiven)
    return console.log('Failed to update master stats')
  const newInfractions =
    (stats.totalInfractions || 0) + (infractions ? infractions : 0)
  const newForgiven = (stats.totalForgiven || 0) + (forgiven ? forgiven : 0)
  await document.set({
    totalInfractions: newInfractions,
    totalForgiven: newForgiven,
  })
  console.log(
    'Updated master stats. Total infractions:',
    newInfractions,
    'Total forgiven:',
    newForgiven,
    'Total offenders:',
    memoedOffenderUserIds.size
  )
}
