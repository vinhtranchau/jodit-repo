import {
	Controls,
	IControlType,
	IControlTypeStrong,
	IDictionary
} from '../../../types';
import { isString } from '../../../core/helpers/';

/**
 * Get control for button name
 * @param button
 * @param controls
 */
export function getControlType(
	button: IControlType | string,
	controls: Controls
): IControlTypeStrong {
	let buttonControl: IControlTypeStrong;

	if (!isString(button)) {
		buttonControl = { name: 'empty', ...button };

		if (controls[buttonControl.name] !== undefined) {
			buttonControl = <IControlTypeStrong>{
				...controls[buttonControl.name],
				...buttonControl
			};
		}
	} else {
		const list = button.split(/\./);

		let store: IDictionary<IControlType> = controls;

		if (list.length > 1) {
			if (controls[list[0]] !== undefined) {
				store = controls[list[0]] as IDictionary<IControlType>;
				button = list[1];
			}
		}

		if (store[button] !== undefined) {
			buttonControl = { name: button, ...store[button] };
		} else {
			buttonControl = {
				name: button,
				command: button,
				tooltip: button
			};
		}
	}

	return buttonControl;
}
