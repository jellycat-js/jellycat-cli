'use strict'

import fs from 'fs'
import * as template from '../../templates/component.js'
import { primary, secondary, orList } from '../../core/utils.js'
import Command from '../../core/command.js'

const availableTagnames = ['div', 'span', 'ul', 'li', 'p', 'label', 'input', 'textarea']
const fileExtension = ['js', 'css', 'html']

export const definition = {
    description: 'Creates a new component class',  
    usage: 'make:component [options] [--] [<component-class>]', 
    args: [
    	[primary('component-class'), `Choose a name for your component class (e.g. ${secondary('App')})`]
   	], 
   	options: [
   		[primary('-t, --tagname=TAGNAME'), `The html tag from which the component extends (${orList(availableTagnames)})`],
   		[primary('-p, --prefix=PREFIX'), `The prefix used for custom html tagname of component ${secondary('[default: "jc"]')}`],
   		[primary('    --only=EXTENSION'), `Generate only one template file (${(orList(fileExtension))})`],
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
        const { inputOptions, inputArguments } = this.parseProcessArgs(args)

        if (inputOptions.includes('-n') || inputOptions.includes('--no-interaction')) {
            if (inputArguments.length === 0) inputArguments[0] = 'App'
        }

		const name = inputArguments.length > 0
			? inputArguments[0]
			: await new Promise(resolve => {
				this.getReadline.question(`\n${primary('Choose a name for your component class (e.g. ')}${secondary('App')}${primary('):')}\n>`, resolve)
			})

		if (name.length === 0) process.exit(1)

    	const ancestor = this.defineAncestor(inputOptions.find(option => /^--tagname=|-t=/.test(option)))
    	const tag = this.defineTagByPrefix(name, inputOptions.find(option => /^--prefix=|-p=/.test(option)))

    	let onlyOption = inputOptions.find(option => /^--only=/.test(option))
    	if (onlyOption !== undefined && fileExtension.includes(onlyOption.split('=')[1])) {
    		onlyOption = onlyOption.split('=')[1]
    	}

		for (const [ext, code] of Object.entries(template))
		{
			if (undefined !== onlyOption && onlyOption !== ext) continue

			const buildedTemplate = code({ name, tag, ancestor, mixinReady: inputOptions.includes('--with-mixin') })

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

    defineAncestor(match)
    {
    	if (match === undefined || !availableTagnames.includes(match.split('=')[1])) {
    		return 'JcComponent'
    	}

    	const tagname = match.split('=')[1]
    	return `Jc${tagname.charAt(0).toUpperCase()}${tagname.slice(1)}Component`
    }

    defineTagByPrefix(name, prefix)
    {
    	prefix = prefix === undefined ? 'jc' : prefix.split('=')[1]
    	return `${prefix}-${name.toLowerCase()}`
    }
}