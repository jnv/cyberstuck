import Dexie from 'dexie'
import GameStatus from '../GameStatus'

const DB_NAME = 'game'

const schemas = {
  'games': 'id,startedAt,rankedScore,initials',
}

function defaultHiscore () {
  const data = require('../defaultHiscore')
  return data.map(item => GameStatus(item))
}

export default function GameDb () {
  Dexie.debug = true
  const db = new Dexie(DB_NAME)

  db.version(1).stores(schemas)

  db.games.hook('creating', (primKey, obj, trans) => {
    if (obj.score > 0 && obj.initials) {
      obj.rankedScore = -obj.score
    }
  })

  db.on('populate', () => {
    console.log('Populating database')
    db.games.bulkAdd(defaultHiscore())
      .then(lastKey => {
        console.log(`Hiscore imported, lastKey = ${lastKey}`)
      })
  })

  return db.games
}
