'use strict'

import { pkg } from '../utils/env.js'
import { primary, secondary } from '../utils/style.js'
import { parseProcessArgs, columnDisplay, help } from '../utils/command.js'

export const description = 'Display information about the Jellycat CLI and environement'

const output = _ => process.stdout.write(`${columnDisplay([
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

export default async args => {

    const { options } = parseProcessArgs(args)

    if (options.includes('-h') || options.includes('--help')) {

        help({
            description: description, 
            usage: 'about', 
            args: [],
            options: [],
            content: [
                `  The ${primary('about')} command displays information about the current Jellycat project.`,
                `  The ${primary('nodejs')} section displays important configuration that could affect your application. The values might be different between web and CLI.`
            ]
        })
        
        process.exit(1)
    }

    output()
    process.exit(1)
}