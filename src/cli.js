'use strict'

import fs from 'fs'
import { error, cmdPath } from './core/utils.js'

export default async args => {

	try
	{
		const commandPath = cmdPath(args.length < 3 || !(fs.existsSync(cmdPath(args[2]))) ? 'list' : args[2])
		const command = await (await import(commandPath)).default
		await (new command()).execute(args.slice(3))
		process.exit(0)
	} 

	catch(e)
	{
		process.stderr.write(error(`Jellycat${e}\n`))
		process.exit(1)
	}
}