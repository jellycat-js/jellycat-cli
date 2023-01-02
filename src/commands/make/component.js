'use strict'

import fs from 'fs'
import readline from 'readline'
import { pkg } from '../../utils/env.js'
import { secondary, primary } from '../../utils/style.js'
import { parseProcessArgs, help } from '../../utils/command.js'
import * as template from '../../templates/component.js'

export const description = 'Creates a new component class'

const buildTemplate = (ext, code, data) => {
	switch(ext)
	{
		case 'js': return code
			.replaceAll('COMPONENT_ANCESTOR', data.ancestor)
			.replaceAll('COMPONENT_NAME', data.name)

		case 'css': return code
			.replaceAll('COMPONENT_TAG', data.tag)

		case 'html': return code
	}
}

export default async args => {

	const { options } = parseProcessArgs(args)

    if (options.includes('-h') || options.includes('--help')) {

        help({
            description: description, 
            usage: 'make:component [options] [--] [<component-class>]', 
            args: [
            	[primary('component-class'), `Choose a name for your component class (e.g. ${secondary('App')})`]
           	], 
           	options: [],
            content: [
            	`  The ${primary('make:component')} command generates a new component class.`,
				`  ${primary('npx jellycat make:component App')}`,
				`  If the argument is missing, the command will ask for the component class name interactively.`,
				`  You can also generate the component js, css or html alone with one of this options:`,
				`  ${primary('npx jellycat make:component --only-js --only-css --only-html')}`
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
			rl.question(`\n${primary('Choose a name for your component class (e.g. ')}${secondary('App')}${primary('):')}\n>`, resolve)
		})

	if (name.length === 0) process.exit(0)

	for (const [ext, code] of Object.entries(template))
	{
		if (Object.keys(pkg('dependencies')).includes('@jellycat-js/jellycat')) {

			if (!fs.existsSync(`${process.env.PWD}/components`)) {
				fs.mkdirSync(`${process.env.PWD}/components`)
			}

			if (!fs.existsSync(`${process.env.PWD}/components/${name}`)) {
				fs.mkdirSync(`${process.env.PWD}/components/${name}`)
			}

			if (!fs.existsSync(`${process.env.PWD}/components/${name}/${name}.${ext}`)) {
				fs.writeFileSync(`${process.env.PWD}/components/${name}/${name}.${ext}`, buildTemplate(ext, code, {
					ancestor: 'JcComponent',
					name: name, // to camel max 2 word
					tag: name // to snakecase
				}), { flag: 'wx' })
			}

		} else {

			if (!fs.existsSync(`${process.env.PWD}/${name}`)) {
				fs.mkdirSync(`${process.env.PWD}/${name}`)
			}

			if (!fs.existsSync(`${process.env.PWD}/${name}/${name}.${ext}`)) {
				fs.writeFileSync(`${process.env.PWD}/${name}/${name}.${ext}`, buildTemplate(ext, code, {
					ancestor: 'JcComponent',
					name: name, // to camel max 2 word
					tag: name // to snakecase
				}), { flag: 'wx' })
			}

		}
	}

	process.exit(0)
}