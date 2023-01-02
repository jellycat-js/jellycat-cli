'use strict'

import * as url from 'url'
import fs from 'fs'

const filename = path => url.fileURLToPath(path)
const dirname = path => url.fileURLToPath(new URL('.', path))
const pkg = (key = false) => {
	const pkgObject = JSON.parse(fs.readFileSync(`${dirname(import.meta.url)}../../package.json`))
	return key ? ( key in pkgObject ? pkgObject[key] : {}) : pkg
}

export { filename, dirname, pkg }