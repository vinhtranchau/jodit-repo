import './about.less';

import { Config } from '../../config';
import { IControlType, IJodit } from '../../types';
import { isLicense, normalizeLicense } from '../../core/helpers/';
import * as consts from '../../core/constants';
import { Dialog } from '../../modules/dialog';

Config.prototype.controls.about = {
	exec: (editor: IJodit) => {
		const dialog = new Dialog({
				language: editor.o.language
			}),
			i18n = editor.i18n.bind(editor);

		dialog.setHeader(i18n('About Jodit'));

		dialog.setContent(
			`<div class="jodit-about">
					<div>${i18n('Jodit Editor')} v.${editor.getVersion()}</div>
					<div>${i18n(
						'License: %s',
						!isLicense(editor.o.license)
							? 'MIT'
							: normalizeLicense(editor.o.license)
					)}</div>
					<div>
						<a href="https://xdsoft.net/jodit/" target="_blank">http://xdsoft.net/jodit/</a>
					</div>
					<div>
						<a href="https://xdsoft.net/jodit/doc/" target="_blank">${i18n(
							"Jodit User's Guide"
						)}</a>
						${i18n('contains detailed help for using')}
					</div>
					<div>${i18n(
						'Copyright © XDSoft.net - Chupurnov Valeriy. All rights reserved.'
					)}</div>
				</div>`
		);

		dialog.open(true);
	},
	tooltip: 'About Jodit',
	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
} as IControlType;

export function about() {
	// Config.buttons.add('about', null, true);
}
