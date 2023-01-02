'use strict'

import cli from '../cli.js'
import Command from '../core/command.js'
import { primary, secondary, filename } from '../core/utils.js'

export const definition = {
    description: 'Display help for a command',  
    usage: 'help [options] [--] [<command_name>]', 
    args: [
        ['command_name', `The command name ${secondary('[default: "help"]')}`]
    ],
    options: [],
    helpContent: [
        `  The ${primary('help')} command displays help for a given command:`,
        `    ${primary('npx jellycat help list')}`,
        `  To display the list of available commands, please use the ${primary('list')} command.`
    ]
}

export default class Help extends Command
{
    constructor() { super(definition) }

    async execute(args)
    {
        const { inputArguments } = this.parseProcessArgs(args)

        if (inputArguments.length > 0) {
            await cli([process.execPath, filename(import.meta.url), inputArguments[0], '--help'])
            process.exit()
        }

        this.help()
        process.exit()
    }
}