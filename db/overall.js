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
    const increment = firestore.FieldValue.increment(1)
    firestore.doc(`master/stats`).update({ totalOtherServerContact: increment })
  },

  async incrementModContactEvents() {
    const increment = firestore.FieldValue.increment(1)
    firestore.doc(`master/stats`).update({ totalModContact: increment })
  },
})
