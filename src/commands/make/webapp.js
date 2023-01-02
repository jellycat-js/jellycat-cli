'use strict'

import Command from '../../core/command.js'
import { primary, secondary } from '../../core/utils.js'

export const definition = {
    description: 'Creates a base webapp',  
    usage: 'make:webapp [options] [--] [<project>]',
    args: [],
	options: [
		[primary('-n, --no-interaction'), `Do not ask any interactive question`]
   	],
    helpContent: []
}

export default class MakeWebapp extends Command
{
    constructor() { super(definition) }

    async execute(args)
    {
    	const { inputOptions } = Command.parseProcessArgs(args)

	    if (inputOptions.includes('-h') || inputOptions.includes('--help')) {
	        this.help()
	        process.exit()
	    }
	    
        process.stdout.write('Not implemented yet\n')
		process.exit()
    }
}