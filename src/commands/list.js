'use strict'

import fs from 'fs'
import Command from '../core/command.js'
import { primary, secondary, pkg, columnDisplay, cmdPath, dirname, resolveCommands } from '../core/utils.js'

export const definition = {
    description: 'List commands', 
    usage: 'list [options] [--] [<namespace>]', 
    args: [
        [primary('namespace'), 'The namespace name']
    ], 
    options: [
        [primary('-V, --version'), `Display this application version`]
    ],
    helpContent: [
        `  The ${primary('list')} command lists all commands:`,
        `    ${primary('npx jellycat list')}`,
        `  You can also display the commands for a specific namespace:`,
        `    ${primary('npx jellycat list test')}`
    ]
}

export default class List extends Command
{
    constructor() { super(definition) }

    async execute(args)
    {
        const { inputOptions, inputArguments } = Command.parseProcessArgs(args)

        if (inputOptions.includes('-h') || inputOptions.includes('--help')) {
            this.help()
            process.exit()
        }

        const output = [
            `Jellycat CLI ${primary(pkg('version'))}\n`,
            `${secondary('Usage:')}\n  command [options] [arguments]\n`,
            secondary('Options:'),
            columnDisplay(this.options, 2),
            secondary('Available commands:')
        ]

        output.forEach(line => process.stdout.write(`${line}\n`))

        const commands = resolveCommands(import.meta.url)
        const namespace = inputArguments.length > 0 ? inputArguments[0] : false

        if (!namespace || !Object.keys(commands).includes(namespace)) {

            const rootCommands = await Promise.all(commands.root.map(async command => {
                return [primary(command), command !== 'list'
                    ? (await import(cmdPath(command))).definition.description
                    : definition.description
                ]
            }))

            process.stdout.write(`${columnDisplay(rootCommands, 2)}`)

            for (const nsTitle of Object.keys(commands).filter(ns => ns != 'root'))
            {
                process.stdout.write(` ${secondary(nsTitle)}\n`)
                const namespaceCommands = await Promise.all(commands[nsTitle].map(async command => {
                    return [ 
                        primary(`${nsTitle}:${command}`), 
                        (await import(cmdPath(`${nsTitle}/${command}`))).definition.description
                    ]
                }))

                process.stdout.write(`${columnDisplay(namespaceCommands, 2)}`)
            }
        
        } else {

            const namespaceCommands = await Promise.all(commands[namespace].map(async command => {
                return [ 
                    primary(`${namespace}:${command}`), 
                    (await import(cmdPath(`${namespace}/${command}`))).definition.description
                ]
            }))

            process.stdout.write(`${columnDisplay(namespaceCommands, 2)}`)
        }

        process.exit()
    }
}