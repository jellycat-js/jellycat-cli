'use strict'

import { filename } from '../utils/env.js'
import { primary, secondary } from '../utils/style.js'
import { parseProcessArgs, help } from '../utils/command.js'
import cli from '../cli.js'

export const description = 'Display help for a command'

export default async args => {

    const { arguments: cmdArgs } = parseProcessArgs(args)

    if (cmdArgs.length > 0) {
        await cli([process.execPath, filename(import.meta.url), cmdArgs[0], '--help'])
        process.exit(1)
    }

    help({
        description: description, 
        usage: 'help [options] [--] [<command_name>]', 
        args: [
            ['command_name', `The command name ${secondary('[default: "help"]')}`]
        ],
        options: [],
        content: [
            `  The ${primary('help')} command displays help for a given command:`,
            `    ${primary('npx jellycat help list')}`,
            `  To display the list of available commands, please use the ${primary('list')} command.`
        ]
    })

    process.exit(1)
}