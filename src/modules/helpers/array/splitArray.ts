/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Split separated elements
 * @param a
 */
export const splitArray = (a: any[] | string): any[] =>
    typeof a === 'string' ? a.split(/[,\s]+/) : a;
