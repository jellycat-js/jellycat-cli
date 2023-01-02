'use strict'

import * as url from 'url'
import fs from 'fs'

const color = {
	error: str => `\x1b[31m${str}\x1b[0m`,
	primary: str => `\x1b[36m\x1b[1m${str}\x1b[0m`,
	secondary: str => `\x1b[34m${str}\x1b[0m`
}

const format = {
	ansiEscapeCodes: str => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''),
	columnDisplay: (items, indent = 0) => {
		const minLength = 20
	    const maxLength = format.ansiEscapeCodes(items.reduce((a, b) => {
	        return format.ansiEscapeCodes(a[0]).length > format.ansiEscapeCodes(b[0]).length ? a[0] : b[0] 
	    })[0]).length
	    
	    return items.map(item => {
	        const length = maxLength > minLength ? maxLength : minLength
	        const space = ' '.repeat((length+2) - format.ansiEscapeCodes(item[0]).length)
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
	filename: path => url.fileURLToPath(path),
	dirname: path => url.fileURLToPath(new URL('.', path)),
	cmdPath: name => `${env.dirname(import.meta.url)}../commands/${name.replace(':', '/')}.js`,
	pkg: (key = false) => {
		const pkgObject = JSON.parse(fs.readFileSync(`${env.dirname(import.meta.url)}../../package.json`))
		return key ? ( key in pkgObject ? pkgObject[key] : {}) : pkg
	}
}

export const { error, primary, secondary } = color
export const { ansiEscapeCodes, columnDisplay, orList } = format
export const { filename, dirname, cmdPath, pkg } = env
