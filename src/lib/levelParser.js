const MAPPING = {
  'x': 1,
}

function trimNewline (str) {
  return str.replace(/^\r?\n|\r?\n$/g, '')
}

export default function parse (levelStr) {
  const rows = trimNewline(levelStr).split(/\r?\n/)

  const result = rows.map(row => {
    return row.split('').map(char => {
      if (MAPPING[char]) {
        return MAPPING[char]
      }
      return false
    })
  })
  console.log(result)
  return result
}
