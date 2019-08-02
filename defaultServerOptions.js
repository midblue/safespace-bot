const blacklistedWords = {
  full: process.env.BLACKLISTED_WORDS_FULL.split(','),
  sanitized: process.env.BLACKLISTED_WORDS_SANITIZED.split(','),
}

module.exports = {
  prefix: 's!',
  contactPoint: null,
  blacklistedWords,
  message: `Hey! That kind of language is unacceptable. We take hate speech seriously around here.

The channel moderators have been notified, and your user id has been logged across all servers using this bot. Think twice before using hate speech next time!

(If you think you\'ve been flagged in error, reach out to the server admins to sort it out.)`,
}
