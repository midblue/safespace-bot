function getWords(text) {
  return text
    .split(/,\s?/g)
    .map(word => word.replace(/^\s*/g, '').replace(/\s*$/g, ''))
}

const full = getWords(process.env.BLACKLISTED_WORDS_FULL),
  sanitized = getWords(process.env.BLACKLISTED_WORDS_SANITIZED)

const blacklistedWords = {
  full,
  sanitized,
}

module.exports = {
  prefix: 's!',
  contact: [],
  blacklistedWords,
  message: `Hey! That kind of language is unacceptable. We take hate speech seriously around here.

The channel moderators have been notified, and your user id has been logged across all servers using this bot. Think twice before using hate speech next time!

(If you think you\'ve been flagged in error, reach out to the server admins to sort it out.)`,
}
