import {uniq, shuffle} from 'lodash'
import {avatar as config} from '../config'

export function generateAvatarId () {
  return `${Math.floor(Date.now() / 100)}`
}

const DEFAULT_AVATARS = [
  'dan',
  'default',
  'dita',
  'frantisek',
  'honza',
  'jak',
  'jakub',
  'josef',
  'marta',
  'tyna',
]

export function spriteKey (id) {
  return `avatar-${id}`
}

function defaultAvatarPath (id) {
  return `assets/avatars/${id}.png`
}

export function preloadDefaultAvatars (game) {
  DEFAULT_AVATARS.forEach(id => {
    const key = spriteKey(id)
    game.load.spritesheet(key, defaultAvatarPath(id), config.width, config.height)
  })

  return DEFAULT_AVATARS
}

export function forceLoadAvatar (game, data, setAsDefault = true) {
  const key = spriteKey(data.avatar)
  game.load.spritesheet(key, data.avatarData, config.width, config.height)
  if (setAsDefault) {
    game.load.spritesheet('avatar', data.avatarData, config.width, config.height)
  }
  game.load.start()
}

export function preloadDataUrls (game, hiscoreObjs) {
  const keys = []
  hiscoreObjs.forEach(obj => {
    if (!obj.avatar || !obj.avatarData) {
      return
    }

    const key = spriteKey(obj.avatar)
    game.load.spritesheet(key, obj.avatarData, config.width, config.height)
    keys.push(obj.avatar)
  })

  return keys
}

export function AvatarPool (...keys) {
  const vals = [].concat(...keys)
  let pool = shuffle(uniq(vals))
  let pointer = 0
  const length = pool.length

  return {
    allocate () {
      const key = pool[pointer]
      pointer++
      if (pointer >= length) {
        pool = shuffle(pool)
        pointer = 0

        if (pool[0] === key) {
          pointer++
        }
      }

      return key
    },
  }
}
