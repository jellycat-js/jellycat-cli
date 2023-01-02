'use strict'

import readline from 'readline'
import { primary, secondary, pkg, columnDisplay } from './utils.js'


export default class Command
{
	constructor({ description, usage, args, options, helpContent })
	{
		this.quiet = false
		this.verbose = 0

		this.description = description
		this.usage = usage
		this.args = args

		this.options = options.concat([
		    [primary('-h, --help'), `Display help for the given command. When no command is given display help for the ${primary('list')} command`],
		    [primary('-q, --quiet'), `Do not output any message`],
		    [primary('-v|vv|vvv, --verbose'), `Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug`]
		])

		this.helpContent = helpContent

		this.readline = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
	}

	parseProcessArgs(args)
	{
    	const inputOptions = args.filter(arg => arg.startsWith('-'))
    	const inputArguments = args.filter(arg => !inputOptions.includes(arg))

    	if (inputOptions.includes('-q') || inputOptions.includes('--quiet')) {
            this.quiet = true
        }

        if (inputOptions.includes('-vvv')) {
        	this.verbose = 3

        } else if (inputOptions.includes('-vv')) {
        	this.verbose = 2

        } else if (inputOptions.includes('-v') || inputOptions.includes('--verbose')) {
            this.verbose = 1
        }

        if (inputOptions.includes('-h') || inputOptions.includes('--help')) {
            this.help()
            process.exit()
        }

    	return { inputOptions, inputArguments }
	}

	async askInput(question)
	{
		return await new Promise(resolve => {
			this.readline.question(question, resolve)
		})	
	}

	async checkAndAskInput([args, index], rule, question)
	{
		let input = typeof args[index] === 'undefined' ? '' : args[index]

		while(!rule.test(input))
		{
			input = await this.askInput(question)
			if (input.length === 0) process.exit(1)
		}

		return input
	}

	isJellycat()
	{
		return Object.keys(pkg('dependencies')).includes('@jellycat-js/jellycat')
	}

	version()
	{
		return `Jellycat CLI ${primary(pkg('version'))}`
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

	    output.forEach(line => this.writeLn(`${line}\n`))
	}

	writeLn($line)
	{
		if (!this.quiet) process.stdout.write($line)
	}
}