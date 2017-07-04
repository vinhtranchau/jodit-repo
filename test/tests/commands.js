describe('Commands Jodit Editor Tests', function() {
    appendTestArea('tested_area', true);
    it('Try exec the command "formatBlock" for several elements', function() {
        var editor = new Jodit('#tested_area');
        editor.setEditorValue('<p>test</p><p>test2</p>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.setStart(editor.editor.firstChild, 0);
        range.setEnd(editor.editor.lastChild, 0);
        sel.removeAllRanges();
        sel.addRange(range);

        editor.execCommand('formatBlock', false, 'h1');

        expect(editor.getEditorValue()).to.equal('<h1>test</h1><h1>test2</h1>');
    });

    it('Try exec the command "formatBlock" for several text nodes', function() {
        var editor = new Jodit('#tested_area');
        editor.setEditorValue('');

        editor.selection.insertNode(editor.node.create('text', 'test'));
        editor.selection.insertNode(editor.node.create('text', ' test2'));
        editor.selection.insertNode(editor.node.create('text', ' test3'));
        editor.selection.insertNode(editor.node.create('span', ' test4'));

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.setStart(editor.editor.firstChild, 0);
        range.setEnd(editor.editor.lastChild, 0);
        sel.removeAllRanges();
        sel.addRange(range);

        editor.execCommand('formatBlock', false, 'h1');

        expect(editor.getEditorValue()).to.equal('<h1>test test2 test3<span> test4</span></h1>');
    });

    it('Try exec the command "bold"', function() {
        var editor = new Jodit('#tested_area');
        editor.setEditorValue('<p>test</p>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.selectNodeContents(editor.editor.firstChild);
        sel.removeAllRanges();
        sel.addRange(range);

        editor.execCommand('bold');

        expect(editor.getEditorValue()).to.equal('<p><strong>test</strong></p>');
    });
    it('Try exec the command "bold" twice', function() {
        var editor = new Jodit('#tested_area');
        editor.setEditorValue('<p>test</p>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.selectNodeContents(editor.editor.firstChild);
        sel.removeAllRanges();
        sel.addRange(range);

        editor.execCommand('bold');
        editor.execCommand('bold');

        expect(editor.getEditorValue()).to.equal('<p>test</p>');
    });
    it('Try exec the command "bold" for font-weight: 700 Element', function() {
        var editor = new Jodit('#tested_area');
        editor.setEditorValue('<span style="font-weight: 700">test</span>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.selectNodeContents(editor.editor.firstChild);
        sel.removeAllRanges();
        sel.addRange(range);

        editor.execCommand('bold');
        // editor.execCommand('bold');

        expect(editor.getEditorValue()).to.equal('<span>test</span>');
    });
    it('After exec some command selection should be restore to previous', function() {
        var editor = new Jodit('#tested_area');
        editor.setEditorValue('<p>test</p>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.setStart(editor.editor.firstChild.firstChild, 2);
        range.setEnd(editor.editor.firstChild.firstChild, 3);
        //range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        editor.execCommand('italic');

        editor.selection.insertNode(editor.doc.createTextNode('top'));

        expect(editor.getEditorValue()).to.equal('<p>tetopt</p>');
    });
    it('After exec some command in collapsed selection - cursor should be inward', function() {
        var editor = new Jodit('#tested_area');
        editor.setEditorValue('<p>test</p>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.setStart(editor.editor.firstChild.firstChild, 2);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);

        editor.execCommand('underline');
        //debugger
        editor.selection.insertNode(editor.doc.createTextNode('data'));

        expect(editor.getEditorValue()).to.equal('<p>te<u>data</u>st</p>');
    });
    describe('insertUnorderedList', function() {
        it('Run command insertUnorderedList should wrap or replace all paragraphs to ul>li', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<p>test</p><p>test</p><p>test</p>');

            editor.execCommand('selectAll');
            editor.execCommand('insertUnorderedList');

            expect(editor.getEditorValue()).to.equal('<ul><li>test</li><li>test</li><li>test</li></ul>');
        });
        it('If press Enter inside <li> in the end it should create new <li> and cursor must be in it', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<ul><li>test</li></ul>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild.firstChild, 4);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.equal('<ul><li>test</li><li> a </li></ul>');
        });
        it('If press Enter inside <li> inside some text should split that text and created new <li> and cursor must be in it', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<ul><li>test</li></ul>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild.firstChild, 2);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.equal('<ul><li>te</li><li> a st</li></ul>');
        });

    });
    describe('Blocks', function() {
        it('Run command formatBlock should wrap or replace container to specialize tag', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<p>testy oprst <span>lets go</span></p>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 5);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('formatBlock', false, 'h5');

            expect(editor.getEditorValue()).to.equal('<h5>testy oprst <span>lets go</span></h5>');
        });
        it('Run command formatBlock and after this set justify', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('testy oprst <span>lets go</span>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild, 5);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('formatBlock', false, 'h5');
            editor.execCommand('justifyLeft');
            editor.execCommand('fontSize', false, 14);

            expect(editor.getEditorValue()).to.equal('<h5 style="text-align: left;">testy<span style="font-size: 14px;"></span> oprst <span>lets go</span></h5>');
        });
    });
    describe('Colors', function() {
        it('Set colour to collapsed position should create empty span and insert inward cursor', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('testy oprst <span>lets go</span>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild, 5);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('foreColor', false, '#f00');

            expect(editor.getEditorValue()).to.equal('testy<span style="color: rgb(255, 0, 0);"></span> oprst <span>lets go</span>');
        });
    })
    describe('Fonts', function() {
        it('Set font size should create attribute style="font-size:value"', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<p> testy oprst <span>lets go</span></p>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.selectNode(editor.editor.querySelector('span'));

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('fontSize', false, 12);

            expect(editor.getEditorValue()).to.equal('<p> testy oprst <span style="font-size: 12px;">lets go</span></p>');

            editor.execCommand('fontSize', false, '12%');
            expect(editor.getEditorValue()).to.equal('<p> testy oprst <span style="font-size: 12%;">lets go</span></p>');
        });
        it('Set font family should create attribute style="font-family:value"', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<p>test</p>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 2);
            range.setEnd(editor.editor.firstChild.firstChild, 4);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('fontName', false, 'Arial');

            expect(editor.getEditorValue()).to.equal('<p>te<span style="font-family: Arial;">st</span></p>');
        });
    });
    describe('Align', function() {
        it('Justify to right', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<p>test</p>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 2);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('justifyright');

            expect(editor.getEditorValue()).to.equal('<p style="text-align: right;">test</p>');
        });
        it('Justify to center', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('test');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild, 2);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('justifycenter');

            expect(editor.getEditorValue()).to.equal('<p style="text-align: center;">test</p>');
        });
        it('Justify to left', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('test some text <span>test</span><br><p>data</p>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild, 8);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('justifyleft');

            expect(editor.getEditorValue()).to.equal('<p style="text-align: left;">test some text <span>test</span><br></p><p>data</p>');
        });
        it('Justify to left in element of unordered list', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<ul><li>test</li><li>data</li></ul>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild.firstChild, 2);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('justifyleft');

            expect(editor.getEditorValue()).to.equal('<ul><li style="text-align: left;">test</li><li>data</li></ul>');
        });
        it('Justify to full', function () {
            var editor = new Jodit('#tested_area');
            editor.setEditorValue('<h1>test some text <span>test</span></h1>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 8);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            editor.execCommand('justifyfull');

            expect(editor.getEditorValue()).to.equal('<h1 style="text-align: justify;">test some text <span>test</span></h1>');
        });
    });
    after(function() {
        tested_area.parentNode.removeChild(tested_area);
    });
    afterEach(function () {
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});
