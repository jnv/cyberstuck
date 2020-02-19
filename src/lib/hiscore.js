import sortedIndexBy from 'lodash/sortedIndexBy'
import GameDb from './db'

const ENTRIES_TOP = 10

const DB = GameDb()

function hiscoreCollection(limit = null) {
  return DB.orderBy('rankedScore').limit(limit)
}

function putGame(gameStatus, finished = true) {
  if (finished) {
    gameStatus.finishedAt = Date.now()
  }
  return DB.put(gameStatus)
}

export function saveGame(gameStatus) {
  return putGame(gameStatus).then(() => gameStatus.id)
}

export function getHiscore(limit = 10) {
  return hiscoreCollection(limit).toArray()
}

function hiscorePosition(score) {
  if (Number.isInteger(score)) {
    score = {score}
  }

  return getHiscore(ENTRIES_TOP).then((entries) => {
    return sortedIndexBy(entries, score, (o) => -o.score)
  })
}

export function hasHiscore(score) {
  if (!score) {
    return Promise.resolve(false)
  }
  return hiscorePosition(score).then((position) => {
    return position < ENTRIES_TOP
  })
}
