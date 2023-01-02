'use strict'

import fs from 'fs'
import Command from '../core/command.js'
import { primary, secondary, columnDisplay, cmdPath, dirname } from '../core/utils.js'

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
        const { inputOptions, inputArguments } = this.parseProcessArgs(args)

        if (inputOptions.includes('-V') || inputOptions.includes('--version')) {
            this.help()
            process.exit()
        }

        const output = [
            `${this.version()}\n`,
            `${secondary('Usage:')}\n  command [options] [arguments]\n`,
            secondary('Options:'),
            columnDisplay(this.options, 2),
            secondary('Available commands:')
        ]

        output.forEach(line => this.writeLn(`${line}\n`))

        const commands = this.resolveCommands(import.meta.url)
        const namespace = inputArguments.length > 0 ? inputArguments[0] : false

        if (!namespace || !Object.keys(commands).includes(namespace)) {

            const rootCommands = await Promise.all(commands.root.map(async command => {
                return [primary(command), command !== 'list'
                    ? (await import(cmdPath(command))).definition.description
                    : definition.description
                ]
            }))

            this.writeLn(`${columnDisplay(rootCommands, 2)}`)

            for (const nsTitle of Object.keys(commands).filter(ns => ns != 'root'))
            {
                this.writeLn(` ${secondary(nsTitle)}\n`)
                const namespaceCommands = await Promise.all(commands[nsTitle].map(async command => {
                    return [ 
                        primary(`${nsTitle}:${command}`), 
                        (await import(cmdPath(`${nsTitle}/${command}`))).definition.description
                    ]
                }))

                this.writeLn(`${columnDisplay(namespaceCommands, 2)}`)
            }
        
        } else {

            const namespaceCommands = await Promise.all(commands[namespace].map(async command => {
                return [ 
                    primary(`${namespace}:${command}`), 
                    (await import(cmdPath(`${namespace}/${command}`))).definition.description
                ]
            }))

            this.writeLn(`${columnDisplay(namespaceCommands, 2)}`)
        }

        process.exit()
    }

    resolveCommands(path)
    {
        const commands = { root: [] }

        fs.readdirSync(dirname(path)).forEach(ls => {
            !fs.lstatSync(`${dirname(path)}/${ls}`).isDirectory()
                ? commands.root.push(ls.split('.')[0])
                : fs.readdirSync(`${dirname(path)}/${ls}`).forEach(file => {
                    if (!Object.keys(commands).includes(ls)) commands[ls] = []
                    commands[ls].push(file.split('.')[0])
                })
        })

        return commands
    }
}