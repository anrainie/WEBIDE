<template>
    <div style="padding: 0px">
        <ul id="editors-indicate" class="editor-tab">
            <div v-show="collapseEditors.length > 0" class="editors-collapse" @click="openCollapseMenu($event)">
                {{collapseEditors.length}}
            </div>
        </ul>
        <div id="editors-content">
        </div>
    </div>
</template>
<style rel="stylesheet">
    .editor-tab{
        display: inline-block;
        width: 100%;
        padding-left: 0px;
        margin-bottom: 0px;
        list-style: none;
        border-bottom: 1px solid #ddd;
    }
    .editor-tab > li{
        float: left;
        margin-bottom: -1px;
        height: 30px;
        width: 100px;
    }
    .editor-tab-active{
        border-top: 1px solid #ddd;
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid white;
    }
    .editor-tab-unactive{
        border-top: 1px solid darkgrey;
        border-left: 1px solid darkgrey;
        border-right: 1px solid darkgrey;
        border-bottom: 1px solid darkgrey;
        background-color: lightgray;
    }
    .editor-tab > li > a{
        display: block;
        margin: 5px;
        text-align: center;
        text-decoration: none;
        cursor:default;
    }
    .editors-collapse {
        display: inline-block;
        float: right;
        height: 29px;
        width: 25px;
        text-align: center;
        background-color: lightgray;
    }

    .editor-tab-delete{
        display: inline-block;
        width: 15px;
        height: 15px;
        float:right;
        background-image: url("~assets/image/nav-delete.png");
    }

</style>
<script type="text/javascript">
    import Vue from 'vue/dist/vue.js'
    export default {
        name:'workbenchPage',
        props: ['config'],
        data(){
            return {
                msgHub : new Vue(),
                //TODO 使用栈
                editors : [],
                activeEditor:null,
                collapseEditors:[],
                maxIndicateCharNum:13,
                defaultIndicateWidth:30,
                eachCharWidth:12
            }
        },
        computed:{
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

                   this.getEditorElement(item.model.path).remove();

                   var editorIndicate = this.getEditorIndicate(item.model.path);
                   editorIndicate.remove();

                   this._deleteEditor(item);
                   editor.$destroy();
                   if(this.editors.length > 0){
                       this.showEditor(this.editors[0].file);
                   }
                   if(this.collapseEditors.length > 0){
                       for(let key in this.collapseEditors){
                           var editor = this.collapseEditors[key];
                           this.popAndShowEditorFromCollEditors(editor.file);
                           break;
                       }
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

                    this.hideAllEditor();
                    this.hideAllTabIndicate();

                    var $li = $("[href='#"+ new_path + "']").parent();
                    $li.attr("class","editor-tab-active");

                    var editor = $('#' + new_path);
                    editor.css('display','block');

                    this.activeEditor = this.getEditor(item);
                    this.activeEditor.focus();

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
            needCollapse(newWidth){
                let allLiWidth = 0 ;
                var $lis = this.PAGE_INDICATE.find("li");
                for(let i = 0 ; i < $lis.length ; i++){
                    allLiWidth += $lis[i].clientWidth ;
                }
                let indicateWidth = this.PAGE_INDICATE.width();
                if(allLiWidth + newWidth > indicateWidth){
                    return true;
                }
                return false;
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
                //TODO 通过ajax获取文件内容
                this.doOpenEditor(item,"test");
            },
            doOpenEditor:function (item,content) {
                var editorDecorator = this.getEditorDecorator(item.model.resId);
                if(!editorDecorator){
                    console.error("can not found editorDecorator with : " + item.model.resId);
                    return;
                }

                this.hideAllEditor();
                this.hideAllTabIndicate();

                var indicateWidth = this.getIndicateWidth(item.model.name);
                var needCollapse = this.needCollapse(indicateWidth);

                //创建tab
                var path = this.revisePath(item.model.path);
                var $li = $("<li></li>");
                $li.css('width',indicateWidth);
                $li.attr("class","editor-tab-active");
                $li.click((function (item,self) {
                    return function () {
                        self.showEditor(item);
                    }
                })(item,this));

                var $a = $("<a></a>");
                $a.text(this.getIndicateName(item.model.name));
                $a.attr("href","#" + path);
                $li.append($a);

                var $close = $("<div></div>");
                $close.attr('class','editor-tab-delete');

                $a.append($close);
                $close.click((function (item,vue) {
                    return function () {
                        vue.closeEditor(item);
                    }
                })(item,this));
                this.PAGE_INDICATE.append($li);


                //创建tab-container
                var $div = $("<div></div>");
                $div.attr("id",path);
                $div.append($("<div id='editor'></div>"));
                this.PAGE_CONTENT.append($div);

                var newEditor = new Vue(editorDecorator);
                newEditor.$props.input = content;
                newEditor.$props.file = item;
                newEditor.$props.msgHub = this.msgHub;
                newEditor.$mount('#' + path + " #editor");

                if(needCollapse){
                   this.hideLastEditorIndicate();
                }
                this.activeEditor = newEditor;
                this.editors.unshift(newEditor);
            },
            hideLastEditorIndicate:function () {
                for(let i = this.editors.length - 1 ; i > 0 ; i--){
                    let lastEditor = this.editors[i];
                    var lastEditorIndicate = this.getEditorIndicate(lastEditor.file.model.path);
                    if(lastEditorIndicate.css('display') != 'none'){
                        lastEditorIndicate.css('display','none');
                        this.collapseEditors.push(lastEditor);
                        break;
                    }
                }
            },
            getEditorDecorator:function (resId) {
                var editorRef = this.config.editorRefs[resId];
                return editorRef;
            },
            revisePath:function (path) {
                return path.replace(/(\/)/g, "_").replace(/(\.)/,"-");
            },
            getIndicateWidth:function (name) {
                var num = 0;
                for (var i = 0; i < name.length; i++) {
                    var c = name.charCodeAt(i);
                    if (c >= 0 && c <= 128)
                        num += 1;
                    else
                        num += 2;
                }
                if(num < 4){
                    return this.defaultIndicateWidth;
                }
                if(num > 13){
                    num = 13;
                }
                return num * this.eachCharWidth;
            },
            getIndicateName:function (name) {
                var num = 0;
                for (var i = 0; i < name.length; i++) {
                    var c = name.charCodeAt(i);
                    if (c >= 0 && c <= 128)
                        num += 1;
                    else
                        num += 2;
                }
                if(num > this.maxIndicateCharNum){
                    name = name.substring(0,this.maxIndicateCharNum);
                    name += "...";
                }
                return name;
            },
            openCollapseMenu:function($event){
                let collMenuItems = this.getCollapseMenuItem();
                CONTEXTMENU.setItems(collMenuItems);
                CONTEXTMENU.setCallback(this.getCollapseMenuConfig());
                CONTEXTMENU.show($event.x - 250,$event.y);
                $event.stopPropagation();
            },
            hideAllEditor:function () {
                for(var i = 0 ; i < this.editors.length ; i++){
                    var editor = this.editors[i];
                    if(editor.$el.parentNode.style.display != 'none'){
                        editor.$el.parentNode.style.display = 'none';
                    }
                }
            },
            hideAllTabIndicate:function () {
                var indicates = $('.editor-tab-active');
                for(var i = 0 ; i < indicates.length ; i ++){
                    var indicate = indicates[i];
                    indicate.className = 'editor-tab-unactive';
                }
            },
            getCollapseMenuConfig:function () {
                let self = this;
               return {
                       onClick: function (menuItem) {
                           var fileItem = NAVI.getItem(menuItem.id);
                           self.hideLastEditorIndicate();
                           self.popAndShowEditorFromCollEditors(fileItem);
                       }
                   }
            },
            popAndShowEditorFromCollEditors(fileItem){
                this.deleteEditorFromCollapseEditors(fileItem);
                let editorIndicate = this.getEditorIndicate(fileItem.model.path);
                editorIndicate.css('display','block');
                this.showEditor(fileItem);
            },
            getCollapseMenuItem:function () {
                let items = [];
                for(let key in this.collapseEditors){
                    let editor = this.collapseEditors[key];
                    let file = editor.file.model;
                    let item = {
                        id:file.path,
                        name:file.name,
                        type:'item'
                    }
                    items.push(item);
                }
                return items;
            },
            deleteEditorFromCollapseEditors:function (item) {
                for(var i = 0 ; i < this.collapseEditors.length ; i ++){
                    var editor = this.collapseEditors[i];
                    if(item.model.path === editor.file.model.path){
                        this.collapseEditors.splice(i,1);
                        break;
                    }
                }
            },
            getEditorIndicate:function (path) {
                let p = this.revisePath(path);
                return $("[href='#"+ p + "']").parent();
            },
            getEditorElement:function (path) {
                let p = this.revisePath(path);
                return $("#" + p);
            }
        },
        mounted(){
            this.PAGE_INDICATE = $("#editors-indicate");
            this.PAGE_CONTENT = $("#editors-content");
            this.msgHub.$on('dirtyStateChange',function (item,dirtyState) {

            });
        },
        beforeDestory:function () {
            this.msgHub.$destroy();
        }
    }
</script>

