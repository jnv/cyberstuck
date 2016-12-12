const Color = require('color')

const palette = require('../src/data/palette.json')

const result = palette.map((hex) => Color(hex).rgbArray())

console.log(JSON.stringify(result))
