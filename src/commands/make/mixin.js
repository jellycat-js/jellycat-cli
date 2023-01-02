'use strict'

import fs from 'fs'
import readline from 'readline'
import { secondary, primary } from '../../utils/style.js'
import { pkg } from '../../utils/env.js'
import { parseProcessArgs, help } from '../../utils/command.js'
import template from '../../templates/mixin.js'

export const description = 'Creates a new mixin class'

export default async args => {

	const { options } = parseProcessArgs(args)

    if (options.includes('-h') || options.includes('--help')) {

        help({
            description: description, 
            usage: 'make:mixin [options] [--] [<mixin-class>]', 
            args: [
            	[primary('mixin-class'), `Choose a name for your mixin class (e.g. ${secondary('CoolStuff')})`]
           	], 
           	options: [],
            content: [
            	`  The ${primary('make:mixin')} command generates a new mixin class.`,
				`  ${primary('npx jellycat make:mixin CoolStuff')}`,
				`  If the argument is missing, the command will ask for the mixin class name interactively.`
            ]
        })
        
        process.exit(1)
    }

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	const name = args.length > 0
		? args[0]
		: await new Promise(resolve => {
			rl.question(`\n${primary('Choose a name for your mixin class (e.g. ')}${secondary('CoolStuff')}${primary('):')}\n>`, resolve)
		})

	if (name.length === 0) process.exit(0)

	const buildedTemplate = template.replace('MIXIN_NAME', name) // to camel

	if (Object.keys(pkg('dependencies')).includes('@jellycat-js/jellycat')) {

		if (!fs.existsSync(`${process.env.PWD}/mixins`)) {
			fs.mkdirSync(`${process.env.PWD}/mixins`)
		}

		if (!fs.existsSync(`${process.env.PWD}/mixins/${name}.js`)) {
			fs.writeFileSync(`${process.env.PWD}/mixins/${name}.js`, buildedTemplate, { flag: 'wx' })
		}

		process.exit(0)
	}

	if (!fs.existsSync(`${process.env.PWD}/${name}.js`)) {
		fs.writeFileSync(`${process.env.PWD}/${name}.js`, buildedTemplate, { flag: 'wx' })
	}

	process.exit(0)
}