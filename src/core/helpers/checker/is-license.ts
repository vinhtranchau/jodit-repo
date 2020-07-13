/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isString } from './is-string';

export const isLicense = (license: string): boolean => {
	return 	isString(license) && license.length === 23 && /^[a-z0-9-]+$/i.test(license);
}
