/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Normalize value to CSS meters
 * @method normalizeSize
 * @param {string|int} value Input string
 * @return {string}
 */
export const normalizeSize = (value: string | number): string => {
    if (/^[0-9]+$/.test(value.toString())) {
        return value + 'px';
    }
    return value.toString();
};
