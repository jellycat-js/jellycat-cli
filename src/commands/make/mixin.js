'use strict'

import fs from 'fs'
import template from '../../templates/mixin.js'
import { primary, secondary } from '../../core/utils.js'
import Command from '../../core/command.js'

export const definition = {
    description: 'Creates a new mixin class',  
    usage: 'make:mixin [options] [--] [<mixin-class>]', 
    args: [
    	[primary('mixin-class'), `Choose a name for your mixin class (e.g. ${secondary('CoolStuff')})`]
   	], 
   	options: [
		[primary('-n, --no-interaction'), `Do not ask any interactive question`]
   	],
    helpContent: [
    	`  The ${primary('make:mixin')} command generates a new mixin class.`,
		`  ${primary('npx jellycat make:mixin CoolStuff')}`,
		`  If the argument is missing, the command will ask for the mixin class name interactively.`
    ]
}

export default class MakeMixin extends Command
{
    constructor() { super(definition) }

    async execute(args)
    {
        const { inputOptions, inputArguments } = this.parseProcessArgs(args)

        if (inputOptions.includes('-n') || inputOptions.includes('--no-interaction')) {
            if (inputArguments.length === 0) inputArguments[0] = 'CoolStuff'
        }

		const name = inputArguments.length > 0
			? inputArguments[0]
			: await new Promise(resolve => {
				this.getReadline.question(`\n${primary('Choose a name for your mixin class (e.g. ')}${secondary('CoolStuff')}${primary('):')}\n>`, resolve)
			})

		if (name.length === 0) process.exit(1)

		const buildedTemplate = template({name}) // to camel

		if (this.isJellycat() && !fs.existsSync(`${process.env.PWD}/mixins`)) {
			fs.mkdirSync(`${process.env.PWD}/mixins`)
		}

		if (!fs.existsSync(`${process.env.PWD}/${this.isJellycat() ? `mixins/${name}`: name}.js`)) {
			fs.writeFileSync(`${process.env.PWD}/${this.isJellycat() ? `mixins/${name}`: name}.js`, buildedTemplate, { flag: 'wx' })
		}

		process.exit()
    }
}