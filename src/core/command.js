'use strict'

import readline from 'readline'
import { primary, secondary, pkg, columnDisplay } from './utils.js'


export default class Command
{
	get readline()
	{
		return _ => readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
	}

	constructor({ description, usage, args, options, helpContent })
	{
		this.description = description
		this.usage = usage
		this.args = args

		this.options = options.concat([
		    [primary('-h, --help'), `Display help for the given command. When no command is given display help for the ${primary('list')} command`],
		    [primary('-q, --quiet'), `Do not output any message`],
		    [primary('-v|vv|vvv, --verbose'), `Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug`]
		])

		this.helpContent = helpContent
	}

	static parseProcessArgs(args)
	{
    	const inputOptions = args.filter(arg => arg.startsWith('-'))
    	const inputArguments = args.filter(arg => !inputOptions.includes(arg))
    	return { inputOptions, inputArguments }
	}

	isJellycat()
	{
		return Object.keys(pkg('dependencies')).includes('@jellycat-js/jellycat')
	}

	help()
	{
		let output = [
			`${secondary('Description:')}\n  ${this.description}\n`,
			`${secondary('Usage:')}\n  ${this.usage}\n`
		]

		if (Array.isArray(this.args) && this.args.length > 0) {
			output = output.concat([secondary('Arguments:'), columnDisplay(this.args, 2)])
	    }

	    if (Array.isArray(this.options) && this.options.length > 0) {
	    	output = output.concat([secondary('Options:'), columnDisplay(this.options, 2)])
		}

		if (Array.isArray(this.helpContent) && this.helpContent.length > 0) {
			output = output.concat([secondary('Help:'), this.helpContent.join('\n\n')])
	    }

	    output.forEach(line => process.stdout.write(`${line}\n`))
	}
}