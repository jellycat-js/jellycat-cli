'use strict'

import * as url from 'url'
import { resolve } from 'path'
import fs from 'fs'

const color = {
	error: str => `_RED_${str}_RESET_`,
	primary: str => `_CYAN__BOLD_${str}_RESET_`,
	secondary: str => `_BLUE_${str}_RESET_`,
	applyColor: str => str
		.replaceAll('_RED_', '\x1b[31m')
		.replaceAll('_CYAN_', '\x1b[36m')
		.replaceAll('_BLUE_', '\x1b[34m')
		.replaceAll('_BOLD_', '\x1b[1m')
		.replaceAll('_RESET_', '\x1b[0m')
}

const format = {
	columnDisplay: (items, indent = 0) => {
		const minLength = 20
		const maxLength = Math.max(...items.map(item => item[0].replaceAll(/_[A-Z]+_/g, '').length))
	    return items.map(item => {
	        const length = maxLength > minLength ? maxLength : minLength
	        const space = ' '.repeat((length+2) - item[0].replaceAll(/_[A-Z]+_/g, '').length)
	        return `${' '.repeat(indent)}${item[0]}${space}${item[1]}`
	    }).join('\n') + '\n'
	},
	orList: arr => {
		let list = arr.join(', ')
		const lastIndex = list.lastIndexOf(', ')
		return `${list.slice(0, lastIndex)} or ${list.slice(lastIndex+1)}`
	}
}

const env = {
	win32support: path => process.platform === "win32" ? resolve(url.pathToFileURL(path).href.replace(/\\/g, '/')) : path,
	filename: path => url.fileURLToPath(path),
	dirname: path => url.fileURLToPath(new URL('.', path)),
	cmdPath: name => env.win32support(`${env.dirname(import.meta.url)}../commands/${name.replace(':', '/')}.js`),
	pkg: (key = false) => {
		const pkgObject = JSON.parse(fs.readFileSync(env.win32support(`${env.dirname(import.meta.url)}../../package.json`)))
		return key ? ( key in pkgObject ? pkgObject[key] : {}) : pkg
	}
}

export const { applyColor, error, primary, secondary } = color
export const { columnDisplay, orList } = format
export const { filename, dirname, cmdPath, pkg, win32support } = env
