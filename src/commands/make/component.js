'use strict'

import fs from 'fs'
import readline from 'readline'
import { pkg } from '../../utils/env.js'
import { secondary, primary } from '../../utils/style.js'
import { parseProcessArgs, help } from '../../utils/command.js'
import * as template from '../../templates/component.js'

export const description = 'Creates a new component class'

export default async args => {

	const { options } = parseProcessArgs(args)

    if (options.includes('-h') || options.includes('--help')) {

        help({
            description: description, 
            usage: 'make:component [options] [--] [<component-class>]', 
            args: [
            	[primary('component-class'), `Choose a name for your component class (e.g. ${secondary('App')})`]
           	], 
           	options: [
           		[primary('-t, --tag=TAG'), `The html tag from which the component extends (div, span, ul, li, p, label, input or textarea)`],
           		[primary('-p, --prefix=PREFIX'), `The prefix used for custom html tagname of component ${secondary('[default: "jc"]')}`],
           		[primary('    --only=EXTENSION'), `Generate only one template file (js, css or html)`],
           		[primary('    --with-mixin'), `Generate component with mixin syntax ready`],
           		[primary('-n, --no-interaction'), `Do not ask any interactive question`]
           	],
            content: [
            	`  The ${primary('make:component')} command generates a new component class.`,
				`  ${primary('npx jellycat make:component App')}`,
				`  If the argument is missing, the command will ask for the component class name interactively.`,
				`  You can also generate the component js, css or html alone with one of this options:`,
				`  ${primary('npx jellycat make:component --only=js')}`
            ]
        })
        
        process.exit()
    }

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	const name = args.length > 0
		? args[0]
		: await new Promise(resolve => {
			rl.question(`\n${primary('Choose a name for your component class (e.g. ')}${secondary('App')}${primary('):')}\n>`, resolve)
		})

	if (name.length === 0) process.exit(1)

	for (const [ext, code] of Object.entries(template))
	{
		const buildedTemplate = code
			.replaceAll('COMPONENT_ANCESTOR', 'JcComponent') // tag option
			.replaceAll('COMPONENT_NAME', name) // to camel max 2 word
			.replaceAll('COMPONENT_TAG', name) // to snakecase

		const webAppArchitectury = Object.keys(pkg('dependencies')).includes('@jellycat-js/jellycat')

		if (webAppArchitectury && !fs.existsSync(`${process.env.PWD}/components`)) {
			fs.mkdirSync(`${process.env.PWD}/components`)
		}

		if (!fs.existsSync(`${process.env.PWD}/${webAppArchitectury ? `components/${name}`: name}`)) {
			fs.mkdirSync(`${process.env.PWD}/${webAppArchitectury ? `components/${name}`: name}`)
		}

		if (!fs.existsSync(`${process.env.PWD}/${webAppArchitectury ? `components/${name}`: name}/${name}.${ext}`)) {
			fs.writeFileSync(`${process.env.PWD}/${webAppArchitectury ? `components/${name}`: name}/${name}.${ext}`, buildedTemplate, { flag: 'wx' })
		}
	}

	process.exit()
}