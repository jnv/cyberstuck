
export function avatarId () {
  return `${Math.floor(Date.now() / 100)}_avatar`
}

export function avatarFileName (id) {
  if (!id) {
    id = avatarId()
  }

  return `${id}.png`
}
