'use strict'

import fs from 'fs'
import { pkg, dirname } from '../utils/env.js'
import { primary, secondary } from '../utils/style.js'
import { genericOptions, parseProcessArgs, columnDisplay, help, cmdPath } from '../utils/command.js'

export const description = 'List commands'

export default async args => {

    const { options, arguments: cmdArgs } = parseProcessArgs(args)

    if (options.includes('-h') || options.includes('--help')) {

        help({
            description: description, 
            usage: 'list [options] [--] [<namespace>]', 
            args: [
                [primary('namespace'), 'The namespace name']
            ], 
            options: [
                [primary('-V, --version'), `Display this application version`]
            ],
            content: [
                `  The ${primary('list')} command lists all commands:`,
                `    ${primary('npx jellycat list')}`,
                `  You can also display the commands for a specific namespace:`,
                `    ${primary('npx jellycat list test')}`
            ]
        })

        process.exit()
    }

    process.stdout.write(`Jellycat CLI ${primary(pkg('version'))}\n\n`)
    process.stdout.write(`${secondary('Usage:')}\n  command [options] [arguments]\n\n`)
    process.stdout.write(`${secondary('Options:')}\n`)
    process.stdout.write(`${genericOptions}\n`)
    process.stdout.write(`${secondary('Available commands:')}\n`)

    const commands = { root: [] }

    fs.readdirSync(dirname(import.meta.url)).forEach(ls => {
        !fs.lstatSync(`${dirname(import.meta.url)}/${ls}`).isDirectory()
            ? commands.root.push(ls.split('.')[0])
            : fs.readdirSync(`${dirname(import.meta.url)}/${ls}`).forEach(file => {
                if (!Object.keys(commands).includes(ls)) commands[ls] = []
                commands[ls].push(file.split('.')[0])
            })
    })

    const namespace = cmdArgs.length > 0 ? cmdArgs[0] : false

    if (!namespace || !Object.keys(commands).includes(namespace)) {

        const rootCommands = await Promise.all(commands.root.map(async command => {
            return [primary(command), command !== 'list'
                ? (await import(cmdPath(command))).description
                : description
            ]
        }))

        process.stdout.write(`${columnDisplay(rootCommands, 2)}`)

        for (const nsTitle of Object.keys(commands).filter(ns => ns != 'root'))
        {
            process.stdout.write(` ${secondary(nsTitle)}\n`)
            const namespaceCommands = await Promise.all(commands[nsTitle].map(async command => {
                return [ primary(`${nsTitle}:${command}`), (await import(cmdPath(`${nsTitle}/${command}`))).description ]
            }))

            process.stdout.write(`${columnDisplay(namespaceCommands, 2)}`)
        }
    
    } else {

        const namespaceCommands = await Promise.all(commands[namespace].map(async command => {
            return [ primary(`${namespace}:${command}`), (await import(cmdPath(`${namespace}/${command}`))).description ]
        }))

        process.stdout.write(`${columnDisplay(namespaceCommands, 2)}`)
    }

    process.exit()
}