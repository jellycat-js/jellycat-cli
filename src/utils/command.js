'use strict'

import { primary, secondary, ansiEscapeCodes } from './style.js'
import { dirname } from './env.js'

const cmdPath = name => {
    return `${dirname(import.meta.url)}../commands/${name.replace(':', '/')}.js`
}

const parseProcessArgs = args => {

    const cmdOptions = args.filter(arg => arg.startsWith('-'))
    const cmdArguments = args.filter(arg => !cmdOptions.includes(arg))

    return { options: cmdOptions, arguments: cmdArguments }
}

const columnDisplay = (items, indent = 0) => {

    const minLength = 20
    const maxLength = ansiEscapeCodes(items.reduce((a, b) => {
        return ansiEscapeCodes(a[0]).length > ansiEscapeCodes(b[0]).length ? a[0] : b[0] 
    })[0]).length
    
    return items.map(item => {
        const length = maxLength > minLength ? maxLength : minLength
        const space = ' '.repeat((length+2) - ansiEscapeCodes(item[0]).length)
        return `${' '.repeat(indent)}${item[0]}${space}${item[1]}`
    }).join('\n') + '\n'
}

const genericOptions = `${secondary('Options:')}\n${columnDisplay([
    [primary('-h, --help'), `Display help for the given command. When no command is given display help for the ${primary('list')} command`],
    [primary('-q, --quiet'), `Do not output any message`],
    [primary('-V, --version'), `Display this application version`],
    [primary('-n, --no-interaction'), `Do not ask any interactive question`],
    [primary('-v|vv|vvv, --verbose'), `Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug`]
], 2)}`

const help = ({ description, usage, args = [], options = [], content = [] }) => {

    process.stdout.write(`${secondary('Description:')}\n  ${description}\n\n`)
    process.stdout.write(`${secondary('Usage:')}\n  ${usage}\n\n`)

    if (Array.isArray(args) && args.length > 0) {
        process.stdout.write(`${secondary('Arguments:')}\n`)
        process.stdout.write(`${columnDisplay(args, 2)}\n`)
    }

    // if (Array.isArray(options) && options.length > 0) {
    //     process.stdout.write(`${secondary('Arguments:')}\n`)
    //     process.stdout.write(`${columnDisplay(args, 2)}\n`)
        process.stdout.write(`${genericOptions}\n`)
    // }

    process.stdout.write(`${genericOptions}\n`)

    if (Array.isArray(content) && content.length > 0) {
        process.stdout.write(`${secondary('Help:')}\n`)
        process.stdout.write(`${content.join('\n\n')}\n`)
    }
}

export {
    cmdPath,
    genericOptions,
    parseProcessArgs,
    columnDisplay,
    help
}