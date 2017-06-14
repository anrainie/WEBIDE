<template>
    <div style="padding: 0px">
        <ul id="editors-indicate" class="editor-tab" >
            <div v-show="collapsedEditors.length > 0" class="editors-collapse contextmenu-dropdown" @click="openCollapseMenu($event)">
                <div></div>
                <span>{{collapsedEditors.length}}</span>
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
        font-size: 14px;
        margin-left: -1px;
    }
    .editor-tab-active{
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid white;
    }
    .editor-tab-unactive{
        border-left: 1px solid darkgrey;
        border-right: 1px solid darkgrey;
        border-bottom: 1px solid #ddd;
        background-color: lightgray;
    }

    .editor-tab > li > img{
        margin-top: -5px;
        margin-left: 5px;
        width: 16px;
        height: 16px;
    }

    .editor-tab > li > a{
        display: inline-block;
        margin-top: 5px;
        margin-left: 10px;
        margin-right: 10px;
        text-align: center;
        text-decoration: none;
        cursor:default;
    }
    .editors-collapse {
        display: inline-block;
        float: right;
        height: 29px;
        width: 30px;
        text-align: center;
        background-color: lightgray;
    }
    .editors-collapse:hover{
        background-color: gray;
    }
    .editors-collapse div{
        display: inline-block;
        position: relative;
        top:20%;
        width: 15px;
        height: 15px;
        background: url("~assets/image/editor-collapse.png") no-repeat;
    }

    .editors-collapse span{
        display: inline-block;
        position: relative;
        top:15%;
    }

    .editor-tab-delete{
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-left: 5px;
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
                collapsedEditors:[],
                maxIndicateCharNum:15
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
            removeEditorFromEditors:function (item) {
                for(var i = 0 ; i < this.editors.length ; i ++){
                    var editor = this.editors[i];
                    if(item.model.path === editor.file.model.path){
                        this.editors.splice(i,1);
                        break;
                    }
                }
            },
            removeEditorFromCollapsedEditors:function (item) {
                for(var i = 0 ; i < this.collapsedEditors.length ; i ++){
                    var editor = this.collapsedEditors[i];
                    if(item.model.path === editor.file.model.path){
                        this.collapsedEditors.splice(i,1);
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

                   this.removeEditorFromEditors(item);
                   editor.$destroy();
                   if(this.editors.length > 0){
                       this.showEditor(this.editors[0].file);
                   }
                   if(this.collapsedEditors.length > 0){
                       for(let key in this.collapsedEditors){
                           var editor = this.collapsedEditors[key];
                           this.showEditor(editor.file);
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
                    this.unActiveAllTabIndicate();

                    var $li = $("[href='#"+ new_path + "']").parent();
                    $li.attr("class","editor-tab-active");
                    $li.css("display","block");

                    var editor = $('#' + new_path);
                    editor.css('display','block');

                    this.removeEditorFromCollapsedEditors(item);
                    this.removeEditorFromEditors(item);
                    this.editors.unshift(oldEditor);

                    this.activeEditor = this.getEditor(item);
                    this.activeEditor.focus();

                    while(this.needCollapse()){
                        this.emptyOutEditorIndicate();
                    }
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
            needCollapse(){
                let allLiWidth = 0 ;
                var $lis = this.PAGE_INDICATE.find("li");
                for(let i = 0 ; i < $lis.length ; i++){
                    if($lis[i].style.display != 'none') {
                        allLiWidth += ( $lis[i].clientWidth + 2);
                    }
                }
                let indicateWidth = this.PAGE_INDICATE.width();
                indicateWidth -= this.PAGE_COLLAPSE_BUTTON.width();

                if(allLiWidth  > indicateWidth ){
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
                this.unActiveAllTabIndicate();

                //创建tab-indicator
                var path = this.revisePath(item.model.path);
                var $li = $("<li></li>");
                $li.attr("class","editor-tab-active");
                $li.click((function (item,self) {
                    return function () {
                        self.showEditor(item);
                    }
                })(item,this));

                if(editorDecorator.methods.getIcon){
                    var icon = editorDecorator.methods.getIcon();
                    var $icon = $('<img></img>');
                    $icon.attr('src',icon);
                    $li.append($icon);
                }

                var $a = $("<a onclick='return false;'></a>");
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

                $li.contextmenu((function (item,edtiorPart) {
                    return function ($event) {
                        $event.preventDefault();
                        edtiorPart.openIndicatorMenu($event,item);
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

                this.activeEditor = newEditor;

                while(this.needCollapse()){
                   this.emptyOutEditorIndicate();
                }

                this.editors.unshift(newEditor);
            },
            emptyOutEditorIndicate:function () {
                for(let i = this.editors.length - 1 ; i > 0 ; i--){
                    let lastEditor = this.editors[i];
                    var lastEditorIndicate = this.getEditorIndicate(lastEditor.file.model.path);
                    if(lastEditorIndicate.css('display') != 'none'){
                        lastEditorIndicate.css('display','none');
                        this.collapsedEditors.push(lastEditor);
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
                let self = this;
                let collMenuItems = [];
                for(let key in this.collapsedEditors){
                    let editor = this.collapsedEditors[key];
                    let file = editor.file.model;
                    let item = {
                        id:file.path,
                        name:file.name,
                        type:'item'
                    }
                    collMenuItems.push(item);
                }
                CONTEXTMENU.setItems(collMenuItems);

                CONTEXTMENU.setCallback({
                    onClick: function (menuItem) {
                        var fileItem = NAVI.getItem(menuItem.id);
                        self.showEditor(fileItem);
                    }
                });
                CONTEXTMENU.show(document.body.scrollLeft + $event.clientX - 250,document.body.scrollTop  + $event.clientY);

                $event.stopPropagation();
            },
            openIndicatorMenu:function ($event,item) {
                var self = this;
                CONTEXTMENU.setItems([{
                    id:'Close',
                    name:'Close',
                    type:'item'
                },{
                    id:'Close Other',
                    name:'Close Other',
                    type:'item'
                },{
                    id:'Close All',
                    name:'Close All',
                    type:'item'
                }]);
                CONTEXTMENU.setCallback({
                    onClick: function (menuItem) {
                        let id = menuItem.id;
                        if(id === 'Close'){
                            self.closeEditor(item);
                        }else if(id === 'Close Other'){
                            let copy = self.editors.concat([]);
                            for(let key in copy){
                                let editor = copy[key];
                                if(editor.file.model.path != item.model.path) {
                                    self.closeEditor(editor.file);
                                }
                            }
                        }else if(id === 'Close All'){
                            let copy = self.editors.concat([]);
                            for(let key in copy){
                                let editor = copy[key];
                                self.closeEditor(editor.file);
                            }
                        }
                    }
                });
                CONTEXTMENU.show($event.clientX,$event.clientY);
            },
            hideAllEditor:function () {
                for(var i = 0 ; i < this.editors.length ; i++){
                    var editor = this.editors[i];
                    if(editor.$el.parentNode.style.display != 'none'){
                        editor.$el.parentNode.style.display = 'none';
                    }
                }
            },
            unActiveAllTabIndicate:function () {
                var indicates = $('.editor-tab-active');
                for(var i = 0 ; i < indicates.length ; i ++){
                    var indicate = indicates[i];
                    indicate.className = 'editor-tab-unactive';
                }
            },
            getEditorIndicate:function (path) {
                let p = this.revisePath(path);
                return $("li a[href='#"+ p + "']").parent();
            },
            getEditorElement:function (path) {
                let p = this.revisePath(path);
                return $("#" + p);
            }
        },
        mounted(){
            this.PAGE_INDICATE = $("#editors-indicate");
            this.PAGE_CONTENT = $("#editors-content");
            this.PAGE_COLLAPSE_BUTTON = $("#editors-indicate .editors-collapse");
            this.msgHub.$on('dirtyStateChange',function (item,dirtyState) {
                //TODO
            });
        },
        beforeDestory:function () {
            this.msgHub.$destroy();
        }
    }
</script>

