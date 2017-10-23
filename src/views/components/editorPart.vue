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
        <el-dialog title="保存" :visible.sync="saveDialog.visible">
            <span>文件已被修改，先保存再关闭?</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="saveDialog.save()" type="primary">保 存</el-button>
                <el-button @click="saveDialog.donotSave()" type="danger">不保存</el-button>
                <el-button @click="resetSaveDialog">取 消</el-button>
            </div>
        </el-dialog>
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
                eachCharWidth:16,
                saveDialog:{
                    visible:false,
                    save:null,
                    donotSave:null
                }
            }
        },
        computed:{
        },
        methods:{
            /**
             * 根据item获取editor
             * @param model
             * @returns {*}
             */
            getEditor:function (model) {
                for(let i = 0 ; i < this.editors.length ; i ++){
                    let editor = this.editors[i];
                    if(model.path === editor.file.path){
                        return editor;
                    }
                }
                return null;
            },
            removeEditorFromEditors:function (model) {
                for(let i = 0 ; i < this.editors.length ; i ++){
                    let editor = this.editors[i];
                    if(model.path === editor.file.path){
                        this.editors.splice(i,1);
                        break;
                    }
                }
            },
            removeEditorFromCollapsedEditors:function (model) {
                for(let i = 0 ; i < this.collapsedEditors.length ; i ++){
                    let editor = this.collapsedEditors[i];
                    if(model.path === editor.file.path){
                        this.collapsedEditors.splice(i,1);
                        break;
                    }
                }
            },
            _doCloseEditor:function (model) {
                if(this.activeEditor && (this.activeEditor.file.path === model.path)){
                    this.activeEditor = null;
                }

                let editorElement = this.getEditorElement(model.path);
                editorElement.remove();

                let editorIndicate = this.getEditorIndicate(model.path);
                editorIndicate.remove();

                this.removeEditorFromEditors(model);

                if(this.editors.length > 0){
                    this.showEditor(this.editors[0].file);
                }else if(this.collapsedEditors.length > 0){
                    let editor = this.collapsedEditors[0];
                    this.collapsedEditors.splice(0,1);
                    this.showEditor(editor.file);
                }
            },
            closeEditor:function (model) {
                let self = this;
                let editor =  this.getEditor(model);
                if(editor){
                   if(editor.isDirty()) {
                       this.saveDialog.visible = true;
                       this.saveDialog.save = function () {
                           let dtd = self.saveEditor();
                           if(dtd){
                               dtd.done(function () {
                                   if(!editor.isDirty()) {
                                       self._doCloseEditor(model);
                                       editor.$destroy();
                                   }
                               }).fail(function () {
                                   editor.dirtyStateChange(true);
                               });
                           }
                           self.resetSaveDialog();
                       }
                       this.saveDialog.donotSave = function () {
                           self._doCloseEditor(model);
                           editor.$destroy();
                           self.resetSaveDialog();
                       }
                   }else {
                       this._doCloseEditor(model);
                       editor.$destroy();
                   }
               }
            },
            resetSaveDialog(){
                this.saveDialog.visible = false;
                this.saveDialog.save = null;
                this.saveDialog.donotSave = null;
            },
            showEditor:function (model) {
                if(this.activeEditor && (this.activeEditor.file.path === model.path) ){
                    return;
                }
                let oldEditor = this.getEditor(model);
                if(oldEditor){
                    let new_path = this.revisePath(model.path);

                    this.hideAllEditor();
                    this.unActiveAllTabIndicate();

                    let $li = $("[href='#"+ new_path + "']").parent();
                    $li.attr("class","editor-tab-active");
                    $li.css("display","block");

                    let editor = $('#' + new_path);
                    editor.css('display','block');

                    this.removeEditorFromCollapsedEditors(model);
                    this.removeEditorFromEditors(model);
                    this.editors.unshift(oldEditor);

                    this.activeEditor = this.getEditor(model);
                    this.activeEditor.focus();

                    while(this.needCollapse()){
                        this.emptyOutEditorIndicate();
                    }
                }
            },
            getActiveEditor:function () {
              return this.activeEditor;
            },
            needCollapse(){
                let allLiWidth = 0 ;
                let $lis = this.PAGE_INDICATE.find("li");
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
                let model;
                if(item.$el){
                    model=item.model;
                }else
                    model=item;
                let oldEditor = this.getEditor(model);
                if(oldEditor){
                   this.showEditor(model);
                   return;
                }
                this.doOpenEditor(model,input);
            },
            doOpenEditor:function (model,content) {
                let editorDecorator = this.getEditorDecorator(model.resId);
                if(!editorDecorator){
                    debug.error("can not found editorDecorator with : " + model.resId);
                    return;
                }

                this.hideAllEditor();
                this.unActiveAllTabIndicate();

                let indicateWidth = this.getIndicateWidth(model.name);

                //创建tab-indicator
                let path = this.revisePath(model.path);
                let $li = $("<li></li>");
                $li.css('width',indicateWidth);
                $li.attr("class","editor-tab-active");
                $li.click((function (model,self) {
                    return function () {
                        self.showEditor(model);
                    }
                })(model,this));

                let $a = $("<span></span>");
                $a.text(this.getIndicateName(model.name));
                $a.attr("href","#" + path);
                $li.append($a);

                let $close = $("<div></div>");
                $close.attr('class','editor-tab-delete');

                $a.append($close);
                $close.click((function (model,vue) {
                    return function () {
                        vue.closeEditor(model);
                    }
                })(model,this));

                $li.contextmenu((function (model,edtiorPart) {
                    return function ($event) {
                        $event.preventDefault();
                        edtiorPart.openIndicatorMenu($event,model);
                    }
                })(model,this));

                this.PAGE_INDICATE.append($li);


                //创建tab-container
                let $div = $("<div></div>");
                $div.attr("id",path);
                $div.append($("<div id='editor'></div>"));
                this.PAGE_CONTENT.append($div);

                let newEditor = new Vue(editorDecorator);

                if(!newEditor.hasOwnProperty("input") || !newEditor.hasOwnProperty("file") || !newEditor.hasOwnProperty("msgHub")){
                    debug.error("$props must has three properties : input,file,msgHub");
                    return;
                }

                if( !$.isFunction(newEditor.isDirty) || !$.isFunction(newEditor.save)
                    || !$.isFunction(newEditor.focus)|| !$.isFunction(newEditor.dirtyStateChange)){
                    debug.error("editor must has three methods : isDirty,save,focus,dirtyStateChange");
                    return;
                }

                newEditor.$props.input = content;
                newEditor.$props.file = model;
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
                    let lastEditorIndicate = this.getEditorIndicate(lastEditor.file.path);
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
                let num = 0;
                for (let i = 0; i < name.length; i++) {
                    let c = name.charCodeAt(i);
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
                if(name.length > this.maxIndicateCharNum){
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
                    let file = editor.file;
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
            openIndicatorMenu:function ($event,model) {
                this.showEditor(model);
                IDE.contextmenu.setItems(editorPartTab);
                IDE.contextmenu.show($event.clientX,$event.clientY,this.activeEditor);
            },
            /**
             * 隐藏所有editor
             */
            hideAllEditor:function () {
                for(let i = 0 ; i < this.editors.length ; i++){
                    let editor = this.editors[i];
                    if(editor.$el.parentNode.style.display != 'none'){
                        editor.$el.parentNode.style.display = 'none';
                    }
                }
            },
            /**
             * 把所有头标签设置为不活动状态
             */
            unActiveAllTabIndicate:function () {
                let indicates = $('.editor-tab-active');
                for(let i = 0 ; i < indicates.length ; i ++){
                    let indicate = indicates[i];
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
            saveEditor(){
                let that = this;
                if(this.activeEditor && this.activeEditor.isDirty() && this.activeEditor.save()) {
                    let dtd = $.Deferred();
                    IDE.socket.emit("saveFile", {
                        type: IDE.type,
                        path: this.activeEditor.file.path,
                        content:this.activeEditor.input,
                        event: 'saveFile',
                    }, function (result) {
                        if(result) {
                            if (result.state === 'success') {
                                that.$notify({
                                    title: '保存',
                                    message: '保存成功',
                                    type: 'success'
                                });
                                dtd.resolve();
                            } else {
                                that.$notify({
                                    title: '保存',
                                    message: '保存失败：' + result.errorMsg,
                                    type: 'error'
                                });
                                dtd.reject();
                            }
                        }
                    });
                    return dtd.promise();
                }
            },
            handleKeyPress:function (event) {
                if(event.ctrlKey){
                    switch(event.which){
                        case 19:{
                            this.saveEditor();
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

