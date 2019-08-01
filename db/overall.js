module.exports = firestore => ({
  async getOverallStats() {
    const document = firestore.doc(`master/stats`)
    const doc = await document.get()
    const data = doc.data()
    return data
  },
})
