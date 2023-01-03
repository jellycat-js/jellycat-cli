'use strict'

import Command from '../core/command.js'
import { primary, secondary, columnDisplay, pkg } from '../core/utils.js'

export const definition = {
    description: 'Display information about the Jellycat, CLI and environement',  
    usage: 'about', 
    args: [],
    options: [],
    helpContent: [
        `  The ${primary('about')} command displays information about the current Jellycat project.`,
        `  The ${primary('nodejs')} section displays important configuration that could affect your application. The values might be different between web and CLI.`
    ]
}

export default class About extends Command
{
    constructor() { super(definition) }
    
    async execute(args)
    {
        this.parseProcessArgs(args)

        this.writeLn(`${columnDisplay([
            ['--------------------', '-------------------------------------------'],
            [` ${primary('Jellycat CLI')}`, ''],
            ['--------------------', '-------------------------------------------'],
            [' Version', ` ${pkg('version')}`],
            [' Long-Term Support', ` No`],
            [' End of maintenance', ` 01/2023 (${secondary('in +30 days')})`],
            [' End of life', ` 01/2023 (${secondary('in +30 days')})`],
            ['--------------------', '-------------------------------------------'],
            [` ${primary('Nodejs')}`, ''],
            ['--------------------', '-------------------------------------------'],
            [' Version', ` ${process.versions.node}`],
            [' Architecture', ` ${process.arch}`],
            [' Intl locale', ` ${process.env.LANG}`],
            [' Timezone', ` ${Intl.DateTimeFormat().resolvedOptions().timeZone} (${secondary((new Date()).toISOString())})`],
            ['--------------------', '-------------------------------------------']
        ])}`)

        process.exit()
    }
}