import path from 'path'
import dataUriToBuffer from 'data-uri-to-buffer'
import storage from 'electron-storage'

const app = require('electron').remote.app

const BASE_DIR = app.getPath('userData')
const IMAGE_DIR = path.join(BASE_DIR, 'img')

export function saveImage (fileName, dataUri) {
  const filePath = path.join(IMAGE_DIR, fileName)
  const buffer = dataUriToBuffer(dataUri)
  console.log(`Saving image to ${filePath}`)
  return storage.set(filePath, buffer)
}
