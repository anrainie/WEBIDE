<template>
    <div >
        <ul id="workbenchPage-indicate" class="nav nav-tabs">
        </ul>
        <div id="workbenchPage-content" class="tab-content">
        </div>
    </div>
</template>
<script type="text/javascript">
    import flowEditor from "../components/floweditor.vue";
    import Vue from 'vue/dist/vue.js'
    export default {
        name:'workbenchPage',
        data(){
            return {
                msgHub : new Vue(),
                //TODO 使用栈
                editors : [],
                activeEditor:null
            }
        },
        computed(){

        },
        methods:{
            getEditor:function (item) {
                for(var i = 0 ; i < this.editors.length ; i ++){
                    var editor = this.editors[i];
                    if(item.model.path === editor.file.model.path){
                        return editor;
                    }
                }
                return null;
            },
            _deleteEditor:function (item) {
                for(var i = 0 ; i < this.editors.length ; i ++){
                    var editor = this.editors[i];
                    if(item.model.path === editor.file.model.path){
                        this.editors.splice(i,1);
                        break;
                    }
                }
            },
            closeEditor:function (item) {
               var editor =  this.getEditor(item);
               if(editor){
                   if(editor.isDirty()) {
                       if (!confirm("编辑器未保存，先保存再关闭？")){
                           return;
                       }
                       editor.save();
                       if(editor.isDirty()){
                           //TODO 保存失败
                           return;
                       }
                   }
                   if(this.activeEditor && (this.activeEditor.file.model.path === item.model.path)){
                       this.activeEditor = null;
                   }
                   var path = this.revisePath(item.model.path);
                   $("#" + path).remove();
                   $("[href='#"+ path + "']").parent().remove();
                   this._deleteEditor(item);
                   editor.$destroy();
                   if(this.editors.length > 0){
                       this.showEditor(this.editors[0].file);
                   }
               }
            },
            showEditor:function (item) {
                if(this.activeEditor && (this.activeEditor.file.model.path === item.model.path) ){
                    return;
                }
                var oldEditor = this.getEditor(item);
                if(oldEditor){
                    var new_path = this.revisePath(item.model.path);
                    var $a = $("[href='#"+ new_path + "']");
                    $a.tab('show');
                    this._deleteEditor(item);
                    this.editors.unshift(oldEditor);
                }
            },
            saveEditor:function (item) {
                var editor = this.getEditor(item);
                if(editor){
                    editor.save();
                }
            },
            getActiveEditor:function () {
              return this.activeEditor;
            },
            openEditor:function (item) {
                var oldEditor = this.getEditor(item);
                if(oldEditor){
                   this.showEditor(item);
                   return;
                }
                this.loadFileContent(item);
            },
            loadFileContent:function (item) {
                var self = this;
                this.doOpenEditor(item,"test");
                /* $.get({
                 url : url,
                 dataType : "json",
                 data : data,
                 success : function(result,status,xhr){
                 this.doOpenEditor(item,result);
                 },
                 error : function(xhr,status,error){
                 //TODO
                 console.info(error);
                 }
                 }
                 );*/
            },
            doOpenEditor:function (item,content) {
                var new_path = this.revisePath(item.model.path);

               // <li draggable="true" class="active">
                //    <a href="#aaa" data-toggle="tab">
                //    </a>
                // </li>

                var $li = $("<li></li>");
                $li.attr("draggable",true);

                var $a = $("<a></a>");
                $a.attr("href","#" + new_path);
                $a.attr("data-toggle","tab");
                $a.attr("class","active");
                $a.text(item.model.name);
                $li.append($a);
                $a.on('shown.bs.tab',(function (item,self) {
                    return function (e) {
                        self.activeEditor = self.getEditor(item);
                        self.activeEditor.focus();
                    }
                })(item,this));

                var $close = $("<span>x</span>");
                $close.css('padding-left','10px');
                $close.css('display','inline-block');
                $a.append($close);
                $close.click((function (item,vue) {
                    return function () {
                        vue.closeEditor(item);
                    }
                })(item,this));

                this.PAGE_INDICATE.append($li);

                var $div = $("<div></div>");
                $div.attr("id",new_path);
                $div.attr("class","tab-pane fade");

                $div.append($("<div :input='input' id='editor'></div>"));
                this.PAGE_CONTENT.append($div);

                var editorDecorator = this.getEditorDecorator(item.model.resId);
                if(!editorDecorator){
                    console.error("can not found editorDecorator with :" + item.model.resId);
                    return;
                }

                var newEditor = new Vue(flowEditor);
                newEditor.$props.input = content;
                newEditor.$props.file = item;
                newEditor.$props.msgHub = this.msgHub;
                newEditor.$mount('#' + new_path + " #editor");

                this.editors.unshift(newEditor);
                $a.tab('show');
            },
            getEditorDecorator:function (resId) {
                return flowEditor;
            },
            revisePath:function (path) {
                return path.replace(/(\/)/g, "_").replace(/(\.)/,"-");
            }
        },
        mounted(){
            this.PAGE_INDICATE = $("#workbenchPage-indicate");
            this.PAGE_CONTENT = $("#workbenchPage-content");
            this.msgHub.$on('dirtyStateChange',function (item,dirtyState) {
                console.info(item.model.path + " dirty change, dirtyState:" + dirtyState );
            });
        },
        beforeDestory:function () {
            this.msgHub.$destroy();
        }
    }
</script>

<style>
</style>

