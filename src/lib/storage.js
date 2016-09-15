import path from 'path'
import dataUriToBuffer from 'data-uri-to-buffer'
import storage from 'electron-storage'
import pify from 'pify'

const fs = pify(require('fs'))
const mkdirp = pify(require('mkdirp'))

const app = require('electron').remote.app

const DATA_DIR = 'data'
const BASE_DIR = path.join(app.getPath('userData'), DATA_DIR)
const AVATARS_DIR = 'avatars'
console.log(`Storage base dir is: ${BASE_DIR}`)

function saveFile (filePath, data) {
  const fullPath = path.resolve(BASE_DIR, filePath)
  const dir = path.dirname(fullPath)
  return mkdirp(dir)
          .then(() => fs.writeFile(fullPath, data))
}

export function saveDataUri (filePath, dataUri) {
  const buffer = dataUriToBuffer(dataUri)
  console.log(`Saving data to ${filePath}`)
  return saveFile(filePath, buffer)
}

function avatarPath (avatarId) {
  return path.join(AVATARS_DIR, `${avatarId}.png`)
}

export function saveAvatar (avatarId, dataUri) {
  const filePath = avatarPath(avatarId)
  return saveDataUri(filePath, dataUri)
}

export function loadJson (file) {
  return storage.get(path.join(DATA_DIR, file))
}

export function saveJson (file, contents) {
  return storage.set(path.join(DATA_DIR, file))
}
