const DEFAULT_STATUS = {
  score: 0,
  lives: 2,
  level: 1,
  avatar: 'avatar-fallback',
  avatarData: null,
  initials: null,
}

function GameStatus (overrides) {
  return {
    ...DEFAULT_STATUS,
    ...overrides,
  }
}

export default GameStatus
