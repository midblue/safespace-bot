export default {
  regex: /^!ping/gi,
  action(msg) {
    msg.reply('Pong!')
  },
}
