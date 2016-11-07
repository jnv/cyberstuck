const DEFAULT_FIELDS = {
  appName: 'CyberStuck',
}

function track () {
  console.verbose('track', ...arguments)
  if (window.IS_DEV) {
    return
  }
  try {
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
    track('send', 'event', category, action, label, value, {
      nonInteraction,
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
  // XXX explicitly call ga directly to execute functions even in DEV
  onReady (callback) {
    if (window.ga) {
      window.ga(callback)
    } else {
      callback()
    }
  },
}
