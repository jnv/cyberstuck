const DEFAULT_FIELDS = {
  appName: 'CyberStuck',
}

function track () {
  try {
    console.verbose('track', ...arguments)
    window.ga(...arguments)
  } catch (e) {
    console.warn(e, arguments)
  }
}

track('create', 'UA-86927605-1', {
  storage: 'none',
})
track('set', 'checkProtocolTask', null)

module.exports = {
  setUser (userId) {
    track('set', 'userId', userId)
  },
  event ({category, action, label = null, value = null, nonInteraction = false}) {
    track('send', 'screen', {
      screenName: name,
      ...DEFAULT_FIELDS,
    })
  },
  screen (name) {
    track('send', 'screen', {
      screenName: name,
      ...DEFAULT_FIELDS,
    })
  },
  timing ({category, variable, value, label = null}) {
    track('send', 'timing', category, variable, value, label, DEFAULT_FIELDS)
  },
}
