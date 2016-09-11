'use strict'
let debuggers
let debug = require('debug')

  /** Services to debug */
let services = [ 'http', 'db', 'bank', 'ML' ]

  /** Set default debuggers */
debuggers = debug('ML')
debuggers.error = debug('ML:error')
debuggers.warning = debug('ML:warning')
debuggers.info = debug('ML:info')

  /** Set debuggers of services */
for (let service of services) {
  debuggers[ service ] = debug(service)
  debuggers[ service ].error = debug(`ML:${service}:error`)
  debuggers[ service ].warning = debug(`ML:${service}:warning`)
  debuggers[ service ].info = debug(`ML:${service}:info`)
}
module.exports = debuggers
