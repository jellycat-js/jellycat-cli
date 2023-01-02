'use strict'

const js = `'use strict'

import { COMPONENT_ANCESTOR } from '@jellycat-js/jellycat'

export default class COMPONENT_NAME extends COMPONENT_ANCESTOR
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

const css = `COMPONENT_TAG {
	display: block;
}`

const html = `<template id="root">
	<div>Hello!</div>
</template>`

export { js, html, css }