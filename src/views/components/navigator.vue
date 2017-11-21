<script>
    import tree from './tree.vue';

    export default {
        extends: tree,
        methods:{
            deleteItem(item){
                let def = IDE.socket.emitAndGetDeferred('deleteFile', {
                    type: IDE.type,
                    path: item.model.path
                }).done((result) => {
                    let editor = IDE.editorPart.getEditor(item.model);
                    if (editor) {
                        IDE.editorPart.closeEditor(item.model);
                    }
                    this._doDeleteItem(item);
                    //item.getParent().refresh();
                }).fail((error) => {
                    this.$notify.error({
                        title: '错误',
                        message: 'delete resource fail , ' + error.errorMsg
                    });
                    debug.error('delete resource fail , ' + error.errorMsg);
                });
            },
            upSearchItem(item,resourceId){
                var parent = item.getParent();
                while(parent && parent != this){
                    if(parent.model.resId === resourceId){
                        return parent;
                    }
                    parent = parent.getParent();
                }
            },
            downSearchItem(item,resourceId){
                var children = item.getChildren();
                while (children && children.length > 0){
                    let newChildren = [];
                    for(let i = 0 ,length = children.length ; i < length ; i++){
                        let chd = children[i];
                        if(chd.model.resId === resourceId){
                            return chd;
                        }
                        let c = chd.getChildren();
                        if(!c && children.length > 0){
                            newChildren = newChildren.concat(c);
                        }
                    }
                    children = newChildren;
                }
            }
        },
        mounted(){
        }
    }
</script>