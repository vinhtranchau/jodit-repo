/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as consts from '../constants';
import { MAY_BE_REMOVED_WITH_KEY } from '../constants';
import { Dom } from '../modules/Dom';
import { isString, normalizeNode, trim } from '../modules/helpers/';
import { IJodit } from '../types';

/**
 * Plug-in process entering Backspace key
 *
 * @module backspace
 */
export function backspace(editor: IJodit) {
	const removeEmptyBlocks = (container: HTMLElement) => {
		let box: HTMLElement | null = container,
			parent: Node | null;

		normalizeNode(container);

		do {
			const html = box.innerHTML.replace(
				consts.INVISIBLE_SPACE_REG_EXP,
				''
			);

			if (
				(!html.length || html === '<br>') &&
				!Dom.isCell(box, editor.editorWindow) &&
				box.parentNode &&
				container !== editor.editor
			) {
				parent = box.parentNode;
				editor.selection.removeNode(box);
			} else {
				break;
			}

			box = parent as HTMLElement | null;
		} while (box && box !== editor.editor);
	};

	const removeChar = (
		box: { node: Node | null },
		toLeft: boolean,
		range: Range
	): void | boolean => {
		if (Dom.isText(box.node) && isString(box.node.nodeValue)) {
			// remove invisible spaces
			let value = box.node.nodeValue,
				startOffset: number = toLeft ? value.length : 0;

			const increment: number = toLeft ? -1 : 1,
				startOffsetInRange: number = startOffset;

			while (
				startOffset >= 0 &&
				startOffset <= value.length &&
				value[startOffset + (toLeft ? -1 : 0)] ===
					consts.INVISIBLE_SPACE
			) {
				startOffset += increment;
			}

			if (startOffset !== startOffsetInRange) {
				if (toLeft) {
					value =
						value.substr(0, startOffset) +
						value.substr(startOffsetInRange);
				} else {
					value =
						value.substr(0, startOffsetInRange) +
						value.substr(startOffset);
					startOffset = startOffsetInRange;
				}

				box.node.nodeValue = value;
			}

			range.setStart(box.node, startOffset);
			range.collapse(true);
			editor.selection.selectRange(range);

			let nextElement: Node | null = Dom.findInline(
				box.node,
				toLeft,
				editor.editor
			);

			if (value.length) {
				let setRange: boolean = false;
				if (toLeft) {
					if (startOffset) {
						setRange = true;
					}
				} else {
					if (startOffset < value.length) {
						setRange = true;
					}
				}

				if (setRange) {
					return true;
				}
			} else {
				range.setStartBefore(box.node);
				range.collapse(true);
				editor.selection.selectRange(range);

				editor.selection.removeNode(box.node);

				box.node = nextElement;
			}

			if (nextElement) {
				if (Dom.isInlineBlock(nextElement)) {
					nextElement = toLeft
						? nextElement.lastChild
						: nextElement.firstChild;
				}

				if (nextElement && nextElement.nodeType === Node.TEXT_NODE) {
					box.node = nextElement;
					return removeChar(box, toLeft, range);
				}
			}
		}
	};

	const potentialRemovable: RegExp = MAY_BE_REMOVED_WITH_KEY;

	const removePotential = (node: Node | null): false | void => {
		if (node && potentialRemovable.test(node.nodeName)) {
			editor.selection.removeNode(node);
			return false;
		}
	};

	const removeInline = (
		box: { node: Node | null },
		toLeft: boolean,
		range: Range
	): boolean | void => {
		if (box.node) {
			const workElement: Node = box.node;
			const removeCharFlag: void | boolean = removeChar(
				box,
				toLeft,
				range
			);

			if (removeCharFlag !== undefined) {
				return true;
			}

			if (!box.node) {
				box.node = workElement.parentNode;
			}

			if (box.node === editor.editor) {
				return false;
			}

			let node: Node | null = box.node;

			if (removePotential(node) === false) {
				return false;
			}

			if (node) {
				node = toLeft ? node.previousSibling : node.nextSibling;
			}

			while (
				node &&
				node.nodeType === Node.TEXT_NODE &&
				node.nodeValue &&
				node.nodeValue.match(/^[\n\r]+$/)
			) {
				node = toLeft ? node.previousSibling : node.nextSibling;
			}

			return removePotential(node);
		}
	};

	const isEmpty = (node: Node): boolean => {
		if (node.nodeName.match(/^(TD|TH|TR|TABLE|LI)$/) !== null) {
			return false;
		}

		if (
			Dom.isEmpty(node) ||
			node.nodeName.match(potentialRemovable) !== null
		) {
			return true;
		}

		if (node.nodeType === Node.TEXT_NODE && !Dom.isEmptyTextNode(node)) {
			return false;
		}

		return node.childNodes.length
			? Array.from(node.childNodes).every(isEmpty)
			: true;
	};

	editor.events
		.on('afterCommand', (command: string) => {
			if (command === 'delete') {
				const current: Node | false = editor.selection.current();

				if (
					current &&
					current.firstChild &&
					current.firstChild.nodeName === 'BR'
				) {
					editor.selection.removeNode(current.firstChild);
				}

				if (
					!trim(editor.editor.textContent || '') &&
					!editor.editor.querySelector('img') &&
					(!current || !Dom.closest(current, 'table', editor.editor))
				) {
					editor.editor.innerHTML = '';

					const node: Node = editor.selection.setCursorIn(
						editor.editor
					);

					editor.selection.removeNode(node);
				}
			}
		})
		.on('keydown', (event: KeyboardEvent): false | void => {
			if (
				event.which === consts.KEY_BACKSPACE ||
				event.which === consts.KEY_DELETE
			) {
				const toLeft: boolean = event.which === consts.KEY_BACKSPACE;

				if (!editor.selection.isFocused()) {
					editor.selection.focus();
				}

				if (!editor.selection.isCollapsed()) {
					editor.execCommand('Delete');
					return false;
				}

				const sel = editor.selection.sel,
					range = sel && sel.rangeCount ? sel.getRangeAt(0) : false;

				if (!range) {
					return false;
				}

				const fakeNode: Node = editor.create.inside.text(
					consts.INVISIBLE_SPACE
				);

				const marker = editor.create.inside.span();

				try {
					range.insertNode(fakeNode);

					if (!Dom.isOrContains(editor.editor, fakeNode)) {
						return false;
					}

					let container: HTMLElement | null = Dom.up(
						fakeNode,
						node => Dom.isBlock(node, editor.editorWindow),
						editor.editor
					) as HTMLElement | null;

					const workElement: Node | null = Dom.findInline(
						fakeNode,
						toLeft,
						editor.editor
					);

					const box = {
						node: workElement
					};

					let tryRemoveInline: boolean | void;

					if (workElement) {
						tryRemoveInline = removeInline(box, toLeft, range);
					} else if (fakeNode.parentNode) {
						tryRemoveInline = removeInline(
							{
								node: toLeft
									? fakeNode.parentNode.previousSibling
									: fakeNode.parentNode.nextSibling
							},
							toLeft,
							range
						);
					}

					if (tryRemoveInline !== undefined) {
						return tryRemoveInline ? undefined : false;
					}

					if (container && container.nodeName.match(/^(TD)$/)) {
						return false;
					}

					let prevBox: Node | false | null = toLeft
						? Dom.prev(
								box.node || fakeNode,
								node => Dom.isBlock(node, editor.editorWindow),
								editor.editor
						  )
						: Dom.next(
								box.node || fakeNode,
								node => Dom.isBlock(node, editor.editorWindow),
								editor.editor
						  );

					if (!prevBox && container && container.parentNode) {
						prevBox = editor.create.inside.element(
							editor.options.enter
						);
						let boxNode: Node = container;

						while (
							boxNode &&
							boxNode.parentNode &&
							boxNode.parentNode !== editor.editor
						) {
							boxNode = boxNode.parentNode;
						}

						boxNode.parentNode &&
							boxNode.parentNode.insertBefore(prevBox, boxNode);
					} else {
						if (prevBox && isEmpty(prevBox)) {
							editor.selection.removeNode(prevBox);
							return false;
						}
					}

					if (prevBox) {
						const tmpNode: Node = editor.selection.setCursorIn(
							prevBox,
							!toLeft
						);

						editor.selection.insertNode(marker, false, false);

						if (
							tmpNode.nodeType === Node.TEXT_NODE &&
							tmpNode.nodeValue === consts.INVISIBLE_SPACE
						) {
							Dom.safeRemove(tmpNode);
						}
					}

					if (container) {
						removeEmptyBlocks(container);

						if (prevBox && container.parentNode) {
							if (
								container.nodeName === prevBox.nodeName &&
								container.parentNode &&
								prevBox.parentNode &&
								container.parentNode !== editor.editor &&
								prevBox.parentNode !== editor.editor &&
								container.parentNode !== prevBox.parentNode &&
								container.parentNode.nodeName ===
									prevBox.parentNode.nodeName
							) {
								container = container.parentNode as HTMLElement;
								prevBox = prevBox.parentNode as HTMLElement;
							}
							Dom.moveContent(container, prevBox, !toLeft);
							normalizeNode(prevBox);
						}

						if (prevBox && prevBox.nodeName === 'LI') {
							const UL: Node | false = Dom.closest(
								prevBox,
								'Ul|OL',
								editor.editor
							);
							if (UL) {
								const nextBox: Node | null = UL.nextSibling;
								if (
									nextBox &&
									nextBox.nodeName === UL.nodeName &&
									UL !== nextBox
								) {
									Dom.moveContent(nextBox, UL, !toLeft);
									editor.selection.removeNode(nextBox);
								}
							}
						}

						removeEmptyBlocks(container);

						return false;
					}
				} finally {
					if (
						fakeNode.parentNode &&
						fakeNode.nodeValue === consts.INVISIBLE_SPACE
					) {
						const parent: Node = fakeNode.parentNode;

						Dom.safeRemove(fakeNode);

						if (
							!parent.firstChild &&
							parent.parentNode &&
							parent !== editor.editor
						) {
							editor.selection.removeNode(parent);
						}
					}

					if (
						marker &&
						Dom.isOrContains(editor.editor, marker, true)
					) {
						const tmpNode:
							| Text
							| false = editor.selection.setCursorBefore(marker);

						Dom.safeRemove(marker);

						if (
							tmpNode &&
							tmpNode.parentNode &&
							(Dom.findInline(
								tmpNode,
								true,
								tmpNode.parentNode
							) ||
								Dom.findInline(
									tmpNode,
									true,
									tmpNode.parentNode
								))
						) {
							Dom.safeRemove(tmpNode);
						}
					}

					editor.setEditorValue();
				}

				return false;
			}
		});
}
