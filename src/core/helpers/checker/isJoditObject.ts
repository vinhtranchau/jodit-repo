/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit } from '../../../types';
import { IToolbarButton } from '../../../types';
import { isFunction } from './isFunction';

/**
 * Check if element is instance of Jodit
 */
export const isJoditObject = (jodit: unknown): jodit is IJodit => {
	if (
		jodit &&
		jodit instanceof Object &&
		isFunction(jodit.constructor) &&
		(jodit instanceof Jodit || (jodit as IJodit).isJodit)
	) {
		return true;
	}

	return false;
};

/**
 * Check if element is instance of Jodit
 */
export const isToolbarButtonObject = (button: unknown): button is IToolbarButton => {
	if (
		button &&
		button instanceof Object &&
		isFunction(button.constructor) &&
		(button instanceof ToolbarButton || (button as IToolbarButton).isToolbarButton)
	) {
		return true;
	}

	return false;
};

import { Jodit } from '../../../jodit';
import { ToolbarButton } from '../../../modules/toolbar/button/button';

