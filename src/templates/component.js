'use strict'

const js = data => `'use strict'

import { ${data.ancestor} } from '@jellycat-js/jellycat'

export default class ${data.name} extends ${data.ancestor}
{
	constructor()
	{ 
		super()
	}

	async init()
	{
		// code...
	}

	async render()
	{
		// code...
	}

	async behavior()
	{
		// code...
	}
}`

const css = data => `${data.tag} {
	display: block;
}`

const html = data => `<template id="root">
	<div>Hello!</div>
</template>`

export { js, html, css }