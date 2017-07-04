var items = [{
        id:'Close',
        name:'Close',
        type:'item',
        handler:function () {
            IDE.editorPart.closeEditor(IDE.editorPart.activeEditor);
        }
    },
    {
        id:'Close Other',
        name:'Close Other',
        type:'item',
        handler:function () {
            let copy = IDE.editorPart.editors.concat([]);
            for(let key in copy){
                let editor = copy[key];
                if(editor.file.model.path != IDE.editorPart.activeEditor.model.path) {
                    IDE.editorPart.closeEditor(editor.file);
                }
            }
        }
    },
    {
        id: 'Close All',
        name: 'Close All',
        type: 'item',
        handler: function () {
            let copy = IDE.editorPart.editors.concat([]);
            for(let key in copy){
                let editor = copy[key];
                IDE.editorPart.closeEditor(editor.file);
            }
        }
    }
]
module.exports = items;