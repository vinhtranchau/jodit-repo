/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Observer} from '../modules/Observer';
import * as consts from '../constants';
import {ctrlKey} from '../modules/Helpers'
import {Config} from "../Config";

Config.prototype.controls.redo ={
    mode: consts.MODE_SPLIT,
    tooltip: 'Redo'
};
Config.prototype.controls.undo = {
    mode: consts.MODE_SPLIT,
    tooltip: 'Undo'
};


export function redoundo(this: any, editor: Jodit) {
    const observer:Observer = new Observer(editor);
    const updateButton = () => {
        editor.events.fire('canRedo', observer.stack.canRedo());
        editor.events.fire('canUndo', observer.stack.canUndo());
    };
    editor.events
        .on('keydown', (e: KeyboardEvent): void | false => {
            if (ctrlKey(e)) {
                if (e.which === consts.KEY_Z || e.which === consts.KEY_Y) {
                    editor.execCommand(e.which === consts.KEY_Z ? 'Undo' : 'Redo');
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }
            }
        }, undefined, undefined,true);


    editor.events
        .on('afterSetMode', () => {
            if (editor.getRealMode() === consts.MODE_WYSIWYG) {
                updateButton();
            }
        })
        .on('beforeCommand', (command: string): void | false => {
            if (command === 'redo' || command === 'undo') {
                if (editor.getRealMode() === consts.MODE_WYSIWYG) {
                    if ((<any>observer.stack)['can' + command.substr(0,1).toUpperCase() + command.substr(1)]()) {
                        observer.stack[command]();
                    }
                    updateButton();
                }
                return false;
            }
        });


    this.destruct = () => {
        observer.destruct();
    };
}