import sortedIndexBy from 'lodash/sortedIndexBy'
import {loadJson, saveJson} from './storage'
const FILE_NAME = 'hiscore.json'

let LOADED = false
let HISCORE

const ENTRIES_TOP = 10
const ENTRIES_CUTOFF = 50

export async function loadHiscore () {
  if (LOADED) {
    return HISCORE
  }

  try {
    HISCORE = await loadJson(FILE_NAME)
  } catch (e) {
    console.log(e)
    HISCORE = require('../defaultHiscore')
  }
  LOADED = true
  console.log('hiscore loaded', HISCORE)
  return HISCORE
}

async function saveHiscore () {
  await saveJson(FILE_NAME, HISCORE.slice(0, ENTRIES_CUTOFF))
}

function hiscorePosition (score) {
  if (Number.isInteger(score)) {
    score = {score}
  }

  return sortedIndexBy(HISCORE, score, o => -o.score)
}

export function addToHiscore (item) {
  if (!item.score && item.score !== 0) {
    throw new Error('Expected object to have property score')
  }

  const index = hiscorePosition(item)
  console.log(`adding hiscore at position ${index}`)

  HISCORE.splice(index, 0, item)

  console.log(HISCORE)

  saveHiscore()

  return index
}

export function getHiscore (onlyTop = true) {
  if (onlyTop) {
    return HISCORE.slice(0, ENTRIES_TOP)
  }

  return HISCORE
}

export function hasHiscore (score) {
  if (score === 0) {
    return false
  }
  const index = hiscorePosition(score)

  return index < ENTRIES_TOP
}
