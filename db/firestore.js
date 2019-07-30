const { Firestore } = require('@google-cloud/firestore')
const firestore = new Firestore()

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
    console.log(`Added new infraction for user ${userId}`)
  },

  async getInfractions({ userId }) {
    if (!userId) return console.log('invalid data to getInfractions!', userId)

    const document = firestore.doc(`users/${userId}`)
    const doc = await document.get()
    const data = doc.data() || {}
    const existingInfractions = data.infractions || []
    return existingInfractions
  },
}

// async function quickstart() {
//   // Obtain a document reference.
//   const document = firestore.doc('users/244651135984467968')

//   // Enter new data into the document.
//   await document.set({
//     infractions: [
//       {
//         date: Date.now(),
//         guild: 'testrealm',
//         guildId: '605053799404666880',
//         channel: 'general',
//         fullMessage: `those nwords`,
//         words: ['nword'],
//       },
//       {
//         date: Date.now(),
//         guild: 'demo guildname 2',
//         guildId: '1234',
//         channel: 'general',
//         fullMessage: `you fword nword`,
//         words: ['fword', 'nword'],
//       },
//     ],
//   })
//   console.log('Entered new data into the document')

//   // Update an existing document.
//   // await document.update({
//   // 	body: 'My first Firestore app',
//   // });
//   // console.log('Updated an existing document');

//   // Read the document.
//   let doc = await document.get()
//   console.log('Read the document', doc.data())

//   // Delete the document.
//   // await document.delete();
//   // console.log('Deleted the document');
// }
// quickstart()
