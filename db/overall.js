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
    if (!data) return
    const newTotal = data.totalMessagesScanned + toAdd
    await document.update({ totalMessagesScanned: newTotal })
  },
})
