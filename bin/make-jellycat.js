#!/usr/bin/env node
import cli from '../src/cli.js'

if (process.versions.node.split('.')[0] < 16) {
	console.error(`You are running Node ${process.versions.node} Jellycat CLI requires Node 16 or higher. Please update your version of Node.`)
    process.exit(1)
}
 
cli(process.argv)