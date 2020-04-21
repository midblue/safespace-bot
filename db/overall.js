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
})
