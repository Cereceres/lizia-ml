'use strict'
let debuggers
let debug = require('debug')

  /** Services to debug */
let services = [ 'http', 'db', 'bank', 'ML', 'fraud', 'event', 'webhook', 'slack' ]

  /** Set default debuggers */
debuggers = debug('psp')
debuggers.error = debug('psp:error')
debuggers.warning = debug('psp:warning')
debuggers.info = debug('psp:info')

  /** Set debuggers of services */
for (let service of services) {
  debuggers[ service ] = debug(service)
  debuggers[ service ].error = debug(`psp:${service}:error`)
  debuggers[ service ].warning = debug(`psp:${service}:warning`)
  debuggers[ service ].info = debug(`psp:${service}:info`)
}
module.exports = debuggers
