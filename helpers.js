const fs = require('fs')
const tilde = require('untildify')

const searchEnd = (x, start) => {
  let i = start
  let gui = 0
  while (i < x.length) {
    if (x[i] === '"') gui++
    if (gui === 2) return i
    i++
  }
}

exports.getXbind = x => {
  let entry = x.split('\n')
  filteredEntry = entry.filter(e => e[0] === '"').map(e => e.replace(/"/gi, '').trim())
  let shortcut = {}
  filteredEntry.forEach(e => {
    let content = x.slice(x.search(e), searchEnd(x, x.search(e))).split('\n')
    content.splice(0, 1)
    content = content.filter(x => x[0] !== '#')
    shortcut[e] = content.filter(Boolean).map(x => x.trim())
  })
  return shortcut
}

// option
// Object
// { command: String, binding: [String] }

exports.addXbind = (gettedXbind, option) => {
  if (!gettedXbind) {
    console.log('incorrect gettedxbind')
    process.exit(0)
  }
  if (!option || (option && (!option.command || !option.binding))) console.log('invalid option for add')
  if (Object.keys(gettedXbind).indexOf(option.command) !== -1) {
    gettedXbind[option.command.trim()].push(option.binding)
    return gettedXbind
  } else {
    gettedXbind[option.command.trim()] = option.binding.map(s => s.trim())
    return gettedXbind
  }
}

exports.deleteXbind = (gettedXbind, command) => {
   if (!gettedXbind) {
    console.log('incorrect gettedxbind')
    process.exit(0)
  }
  if (!command) {
    console.log('incorrect binding name')
  }
  delete gettedXbind[command]
  return gettedXbind
}

exports.writeXbind = gettedXbind => {
  if (!gettedXbind) {
    console.log('incorrect gettedxbind')
    process.exit(0)
  }
  let content = ''
  for (let command in gettedXbind) {
    content += `"${command}"\n`
    gettedXbind[command].forEach(x => content += `\t${x}\n`)
  }
  fs.writeFileSync(tilde('~/.xbindkeysrc'), content, {encoding: 'utf8'})
}
