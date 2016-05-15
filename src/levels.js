import spec from './levelsSpec'
import parser from './lib/levelParser'

const levels = {}
spec.forEach((str, idx) => {
  levels[idx + 1] = parser(str)
})

export default levels
