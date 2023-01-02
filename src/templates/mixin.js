'use strict'

export default data => `'use strict'

export default function ${data.name}(superclass)
{
	return class extends superclass
	{
		// code...
	}
}`