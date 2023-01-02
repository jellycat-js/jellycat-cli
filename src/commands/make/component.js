'use strict'

import fs from 'fs'
import * as template from '../../templates/component.js'
import { primary, secondary } from '../../core/utils.js'
import Command from '../../core/command.js'

export const definition = {
    description: 'Creates a new component class',  
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
}

export default class MakeComponent extends Command
{
    constructor() { super(definition) }

    async execute(args)
    {
        const { inputOptions } = Command.parseProcessArgs(args)

	    if (inputOptions.includes('-h') || inputOptions.includes('--help')) {
	        this.help()
	        process.exit()
	    }

		const name = args.length > 0
			? args[0]
			: await new Promise(resolve => {
				this.getReadline.question(`\n${primary('Choose a name for your component class (e.g. ')}${secondary('App')}${primary('):')}\n>`, resolve)
			})

		if (name.length === 0) process.exit(1)

		for (const [ext, code] of Object.entries(template))
		{
			const buildedTemplate = code({ name, tag: name, ancestor: 'JcComponent' })

			if (this.isJellycat() && !fs.existsSync(`${process.env.PWD}/components`)) {
				fs.mkdirSync(`${process.env.PWD}/components`)
			}

			if (!fs.existsSync(`${process.env.PWD}/${this.isJellycat() ? `components/${name}`: name}`)) {
				fs.mkdirSync(`${process.env.PWD}/${this.isJellycat() ? `components/${name}`: name}`)
			}

			if (!fs.existsSync(`${process.env.PWD}/${this.isJellycat() ? `components/${name}`: name}/${name}.${ext}`)) {
				fs.writeFileSync(`${process.env.PWD}/${this.isJellycat() ? `components/${name}`: name}/${name}.${ext}`, buildedTemplate, { flag: 'wx' })
			}
		}

		process.exit()
    }
}