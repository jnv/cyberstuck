import cuid from 'cuid'

const DEFAULT_STATUS = {
  score: 0,
  lives: 2,
  level: 1,
  avatar: 'default',
  avatarData: null,
  initials: null,
  finishedAt: null,
  rankedScore: 0,
}

function GameStatus (overrides) {
  return Object.seal({
    ...DEFAULT_STATUS,
    ...overrides,
    startedAt: Date.now(),
    id: cuid(),
  })
}

export default GameStatus
