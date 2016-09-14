import path from 'path'
import dataUriToBuffer from 'data-uri-to-buffer'
import storage from 'electron-storage'

const app = require('electron').remote.app

const BASE_DIR = app.getPath('userData')
const AVATARS_DIR = 'avatars'

export function saveDataUri (fileName, dataUri) {
  const filePath = path.resolve(BASE_DIR, fileName)
  const buffer = dataUriToBuffer(dataUri)
  console.log(`Saving data to ${filePath}`)
  return storage.set(filePath, buffer)
}

function avatarPath (avatarId) {
  return path.join(AVATARS_DIR, `${avatarId}.png`)
}

export function saveAvatar (avatarId, dataUri) {
  const filePath = avatarPath(avatarId)
  return saveDataUri(filePath, dataUri)
}
