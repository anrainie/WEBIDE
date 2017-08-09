<template>
    <div>
        <ul id="editors-indicate" class="editor-tab contextmenu-dropdown" >
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
        border-bottom: 1px solid #271212;
    }
    .editor-tab > li{
        float: left;
        margin-bottom: 1px;
        height: 30px;
        width: 100px;
    }
    .editor-tab-active{
        background-color: white;
    }
    .editor-tab-unactive{
    }
    .editor-tab > li > span{
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
        width: 30px;
        text-align: center;
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
        float:right;
        background-image: url("~assets/image/nav-delete.png");
    }

</style>
<script type="text/javascript">
    import Vue from 'vue';
    import editorPartTab from '../../action/editorPartTab.contextmenu';
    export default {
        name:'workbenchPage',
        props: ['config'],
        data(){
            return {
                msgHub : new Vue(),
                //TODO 使用栈
                editors : [],
                activeEditor:null,
                //TODO 使用变量标志，需重写
                collapsedEditors:[],
                maxIndicateCharNum:15,
                defaultIndicateWidth:30,
                eachCharWidth:12
            }
        },
        computed:{
        },
        methods:{
            /**
             * 根据item获取editor
             * @param item
             * @returns {*}
             */
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
            openEditor:function (item,input) {
                var oldEditor = this.getEditor(item);
                if(oldEditor){
                   this.showEditor(item);
                   return;
                }
                this.doOpenEditor(item,input);
            },
            doOpenEditor:function (item,content) {
                var editorDecorator = this.getEditorDecorator(item.model.resId);
                if(!editorDecorator){
                    debug.error("can not found editorDecorator with : " + item.model.resId);
                    return;
                }

                this.hideAllEditor();
                this.unActiveAllTabIndicate();

                var indicateWidth = this.getIndicateWidth(item.model.name);

                //创建tab-indicator
                var path = this.revisePath(item.model.path);
                var $li = $("<li></li>");
                $li.css('width',indicateWidth);
                $li.attr("class","editor-tab-active");
                $li.click((function (item,self) {
                    return function () {
                        self.showEditor(item);
                    }
                })(item,this));

                var $a = $("<span></span>");
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

                if(!newEditor.hasOwnProperty("input") || !newEditor.hasOwnProperty("file") || !newEditor.hasOwnProperty("msgHub")){
                    debug.error("$props of editor must has three methods : isDirty,save,focus");
                    return;
                }

                if( typeof newEditor.isDirty != 'function' || typeof newEditor.save != 'function' || typeof newEditor.focus != 'function'){
                    debug.error("editor must has three methods : isDirty,save,focus");
                    return;
                }

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
                return this.config.editorRefs[resId];
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
                if(num > this.maxIndicateCharNum){
                    num = this.maxIndicateCharNum;
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
            /**
             * 打开收缩editors的右键菜单
             */
            openCollapseMenu:function($event){
                let self = this;
                let collMenuItems = [];
                for(let key in this.collapsedEditors){
                    let editor = this.collapsedEditors[key];
                    let file = editor.file.model;
                    let item = {
                        id:file.path,
                        name:file.name,
                        type:'item',
                        handler:function () {
                            self.showEditor(editor.file);
                        }
                    }
                    collMenuItems.push(item);
                }
                IDE.contextmenu.setItems(collMenuItems);
                IDE.contextmenu.show($event.x - 250,$event.y);
            },
            /**
             * 打开头标签的右键菜单
             */
            openIndicatorMenu:function ($event,item) {
                this.showEditor(item);
                IDE.contextmenu.setItems(editorPartTab);
                IDE.contextmenu.show($event.clientX,$event.clientY,this.activeEditor);
            },
            /**
             * 隐藏所有editor
             */
            hideAllEditor:function () {
                for(var i = 0 ; i < this.editors.length ; i++){
                    var editor = this.editors[i];
                    if(editor.$el.parentNode.style.display != 'none'){
                        editor.$el.parentNode.style.display = 'none';
                    }
                }
            },
            /**
             * 把所有头标签设置为不活动状态
             */
            unActiveAllTabIndicate:function () {
                var indicates = $('.editor-tab-active');
                for(var i = 0 ; i < indicates.length ; i ++){
                    var indicate = indicates[i];
                    indicate.className = 'editor-tab-unactive';
                }
            },
            /**
             *获取editor头标签
             */
            getEditorIndicate:function (path) {
                let p = this.revisePath(path);
                return $("li span[href='#"+ p + "']").parent();
            },
            /**
             * 获取editor的Element
             * @param path
             * @returns {jQuery|HTMLElement}
             */
            getEditorElement:function (path) {
                let p = this.revisePath(path);
                return $("#" + p);
            },
            handleKeyPress:function (event) {
                var that = this;
                if(event.ctrlKey){
                    switch(event.which){
                        case 19:{
                            //TODO  临时代码，需要判断dirty ： this.activeEditor.isDirty()
                            if(this.activeEditor ){
                                if(this.activeEditor.save()) {
                                    IDE.socket.emit("saveFile", {
                                        type: IDE.type,
                                        path: this.activeEditor.file.model.path,
                                        content:this.activeEditor.input,
                                        event: 'saveFile',
                                    }, function (data) {
                                        if(data) {
                                            let result = JSON.parse(data);
                                            if (result.state === 'success') {
                                                that.$notify({
                                                    title: '保存',
                                                    message: '保存成功',
                                                    type: 'success'
                                                });
                                            } else {
                                                that.$notify({
                                                    title: '保存',
                                                    message: '保存失败：' + result.errorMsg,
                                                    type: 'error'
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                            break;
                        }
                    }
                }
            }
        },
        mounted(){
            this.PAGE_INDICATE = $("#editors-indicate");
            this.PAGE_CONTENT = $("#editors-content");
            this.PAGE_COLLAPSE_BUTTON = $("#editors-indicate .editors-collapse");
        },
        beforeDestory:function () {
            this.msgHub.$destroy();
        }
    }
</script>

