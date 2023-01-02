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
    	const { inputOptions } = this.parseProcessArgs(args)

        if (inputOptions.includes('-n') || inputOptions.includes('--no-interaction')) {
            
        }

        this.writeLn('Not implemented yet\n')
		process.exit()
    }
}