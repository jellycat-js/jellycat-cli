'use strict'

import fs from 'fs'
import { exec, execSync } from 'child_process'
import Command from '../../core/command.js'
import { primary, secondary, win32support } from '../../core/utils.js'

export const definition = {
    description: 'Creates a base webapp',  
    usage: 'make:webapp [options] [--] [<project-dirname>]',
    args: [
        [primary('project-dirname'), `Choose a name for your Jellycat project directory (e.g. ${secondary('jellycat-app')})`]
    ],
	options: [
        [primary('    --stand-alone'), `Build stand alone webapp`],
		[primary('-n, --no-interaction'), `Do not ask any interactive question`]
   	],
    helpContent: []
}

export default class MakeWebapp extends Command
{
    constructor() { super(definition) }

    async execute(args)
    {
    	const { inputOptions, inputArguments } = this.parseProcessArgs(args)

        if (inputOptions.includes('-n') || inputOptions.includes('--no-interaction')) {
            if (typeof inputArguments[0] === 'undefined') inputArguments[0] = 'jellycat-app'
        }

        const name = await this.checkAndAskInput([inputArguments, 0], [null, null])
        const projectDir = win32support(`${process.env.PWD}/${name}`)

        if (fs.existsSync(projectDir)) {
            throw new Error(`Directory with name ${name} already exists in ${win32support(process.env.PWD)}`)
        }

        // fs.mkdirSync(projectDir)

        // execSync(`cd ./${name} && npm init -y`)
        // execSync(`cd ./${name} && npm i -S --package-lock-only --no-package-lock jellycat-js/jellycat`)

        // execSync(`cd ./${name} && parcel`)

        // execSync(`cd ./${name} && cat > index.css`)
        // execSync(`cd ./${name} && cat > index.js`)
        // execSync(`cd ./${name} && cat > index.html`)

        // fs.mkdirSync(`${projectDir}/webapp`) // src ?
        // fs.mkdirSync(`${projectDir}/webapp/components`)
        // fs.mkdirSync(`${projectDir}/webapp/mixins`)
        // fs.mkdirSync(`${projectDir}/webapp/utils`)

        // fs.mkdirSync(`${projectDir}/webapp/components/App`)

        this.writeLn('Not implemented yet\n')
		process.exit()
    }
}