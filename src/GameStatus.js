const DEFAULT_STATUS = {
  score: 0,
  lives: 2,
  level: 1,
  avatar: 'default',
  avatarData: null,
  initials: null,
}

function GameStatus (overrides) {
  return Object.seal({
    ...DEFAULT_STATUS,
    ...overrides,
  })
}

export default GameStatus
