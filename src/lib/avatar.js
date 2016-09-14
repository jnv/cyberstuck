
export function generateAvatarId () {
  return `${Math.floor(Date.now() / 100)}`
}
