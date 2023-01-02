'use strict'

import fs from 'fs'
import { error } from './utils/style.js'
import { cmdPath } from './utils/command.js'

export default async args => {

	try
	{
		const commandPath = cmdPath(args.length < 3 || !(fs.existsSync(cmdPath(args[2]))) ? 'list' : args[2])
		await (await import(commandPath)).default(args.slice(3))
		process.exit(1)
	} 

	catch(e)
	{
		process.stderr.write(error(`Jellycat${e}\n`))
		process.exit(1)
	}
}