import {editorClassLib} from './editorClassLib'
import {$AG} from "anrajs"

/*用于参数忽略的时候*/
function throwIfMissing() {
    throw new Error('Missing parameter');
}

class EditorBuilder {
    constructor(editor = throwIfMissing()) {
        this.editor = editor;
    }

    static create(className = throwIfMissing()) {
        if (editorClassLib.hasOwnProperty(className)) {
            return function () {

                //实例化一个对象
                var obj = {};
                obj.__proto__ = editorClassLib[className].prototype;
                editorClassLib[className].apply(obj, arguments);

                return obj;
            };
        }
        //TODO throw warn
    }

    static handle(editor) {
        if (editor instanceof  $AG.Editor) {
            return new EditorBuilder(editor);
        }
    }

    //通用操作
    createContent() {
        this.editor.createContent(this.editor.config.id);

        return this;
    }

    removeContent() {
        $('#' + this.editor.config.id).children().last().remove();

        return this;
    }

    bindingEvent(key, event) {
        this.editor.rootEditPart.$on(key, event);

        return this;
    }
}

export {EditorBuilder}