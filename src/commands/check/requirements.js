'use strict'

import Command from '../../core/command.js'


export const definition = {
    description: 'Check requirements for Jellycat projects',  
    usage: 'check:requirements [options] [options]', 
    args: [], 
    options: [],
    content: []
}

export default class CheckRequirements extends Command
{
    constructor() { super(definition) }

    async execute(args)
    {
        this.writeLn('Not implemented yet\n')
        process.exit()
    }
}

// Symfony Requirements Checker
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// > PHP is using the following php.ini file:
// /etc/php/8.1/cli/php.ini

// > Checking Symfony requirements:

// ...............W..........

                                              
//  [OK]                                         
//  Your system is ready to run Symfony projects 
                                              

// Optional recommendations to improve your setup
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//  * intl extension should be available
//    > Install and enable the intl extension (used for validators).


// Note  The command console can use a different php.ini file
// ~~~~  than the one used by your web server.
//       Please check that both the console and the web server
//       are using the same PHP version and configuration.