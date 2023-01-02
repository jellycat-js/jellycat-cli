'use strict'

const error   = str => `\x1b[31m${str}\x1b[0m`
const primary = str => `\x1b[36m\x1b[1m${str}\x1b[0m`
const secondary  = str => `\x1b[34m${str}\x1b[0m`

const ansiEscapeCodes = str => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')

export { error, primary, secondary, ansiEscapeCodes }