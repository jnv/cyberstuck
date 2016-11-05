import sortedIndexBy from 'lodash/sortedIndexBy'
import GameDb from './db'

const ENTRIES_TOP = 10

const DB = GameDb()

function hiscoreCollection (limit = null) {
  return DB
    .orderBy('rankedScore')
    .limit(limit)
}

export function addGame (gameStatus, finished = true) {
  if (finished) {
    gameStatus.finishedAt = Date.now()
  }
  return DB.add(gameStatus)
}

export function addToHiscore (gameStatus) {
  return addGame(gameStatus).then(() => gameStatus.id)
}

export function getHiscore (limit = 10) {
  return hiscoreCollection(limit).toArray()
}

function hiscorePosition (score) {
  if (Number.isInteger(score)) {
    score = {score}
  }

  const entries = getHiscore(ENTRIES_TOP)

  return sortedIndexBy(entries, score, o => -o.score)
}

export function hasHiscore (score) {
  if (!score) {
    return false
  }
  const index = hiscorePosition(score)

  return index < ENTRIES_TOP
}

export function hasHiscoreOrSave (gameStatus) {
  if (hasHiscore) {
    return Promise.resolve(true)
  }

  return addGame(gameStatus).then(() => false)
}
