const { Firestore } = require('@google-cloud/firestore')
const increment = Firestore.FieldValue.increment(1)

module.exports = firestore => ({
  async getOverallStats() {
    const document = firestore.doc(`master/stats`)
    const doc = await document.get()
    const data = doc.data()
    return data
  },

  async addToTotalScanned(toAdd) {
    const document = firestore.doc(`master/stats`)
    const doc = await document.get()
    const data = doc.data()
    if (!data || !data.totalMessagesScanned) return
    const newTotal = parseInt(data.totalMessagesScanned) + toAdd
    await document.update({ totalMessagesScanned: newTotal })
  },

  async incrementOtherServerContactEvents() {
    firestore.doc(`master/stats`).update({ totalOtherServerContact: increment })
  },

  async incrementModContactEvents() {
    firestore.doc(`master/stats`).update({ totalModContact: increment })
  },
})
