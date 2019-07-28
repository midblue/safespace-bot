const commands = [require('./ping')]

export default function(msg) {
  console.log('looking for command')
  for (let c of commands) {
    console.log(c)
    if (c.regex.exec(msg.content)) {
      c.action(msg)
      return true
    }
  }
}
