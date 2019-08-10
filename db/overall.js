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
    if (!data)
      return document.set({
        totalMessagesScanned: newTotal,
        totalInfractions: 0,
        totalForgiven: 0,
      })
    const newTotal = (data.totalMessagesScanned || 0) + toAdd
    await document.set({ totalMessagesScanned: newTotal })
  },
})
