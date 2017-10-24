var items = [{
        id:'Close',
        name:'Close',
        type:'item',
        handler:function (selectedEditor) {
            IDE.editorPart.closeEditor(selectedEditor.file);
        }
    },
    {
        id:'Close Other',
        name:'Close Other',
        type:'item',
        handler:function (selectedEditor) {
            let copy = IDE.editorPart.editors.concat([]);
            for(let key in copy){
                let editor = copy[key];
                if(editor.file.path !=selectedEditor.file.path) {
                    IDE.editorPart.closeEditor(editor.file);
                }
            }
        }
    },
    {
        id: 'Close All',
        name: 'Close All',
        type: 'item',
        handler: function (selectedEditor) {
            let copy = IDE.editorPart.editors.concat([]);
            for(let key in copy){
                let editor = copy[key];
                IDE.editorPart.closeEditor(editor.file);
            }
        }
    }
]
module.exports = items;