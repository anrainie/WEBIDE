<template>
    <div>
        <ul id="editors-indicate" class="editor-tab contextmenu-dropdown">
            <div v-show="collapsedEditorNum > 0" class="editors-collapse contextmenu-dropdown"
                 @click="openCollapseMenu($event)">
                <div></div>
                <span>{{collapsedEditorNum}}</span>
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
    .editor-tab {
        display: inline-block;
        width: 100%;
        padding-left: 0px;
        margin-bottom: 0px;
        list-style: none;
        border-bottom: 1px solid #271212;
    }

    .editor-tab > li {
        float: left;
        margin-bottom: 1px;
        height: 30px;
        width: 100px;
    }

    .editor-tab-active {
        background-color: white;
    }

    .editor-tab-unactive {
    }

    .editor-tab > li > span {
        display: block;
        margin: 5px;
        text-align: center;
        text-decoration: none;
        cursor: default;
    }

    .editors-collapse {
        display: inline-block;
        float: right;
        height: 29px;
        width: 30px;
        text-align: center;
    }

    .editors-collapse:hover {
        background-color: gray;
    }

    .editors-collapse div {
        display: inline-block;
        position: relative;
        top: 20%;
        width: 15px;
        height: 15px;
        background: url("~assets/image/editor-collapse.png") no-repeat;
    }

    .editors-collapse span {
        display: inline-block;
        position: relative;
        top: 15%;
    }

    .editor-tab-delete {
        display: inline-block;
        width: 15px;
        height: 15px;
        float: right;
        background-image: url("~assets/image/nav-delete.png");
    }
</style>
<script type="text/javascript">
    import Vue from 'vue';
    import KeyManager from '../../utils/keyManager';
    import editorPartTab from '../../action/editorPartTab.contextmenu';
    export default {
        name: 'workbenchPage',
        props: ['config', 'domain'],
        data(){
            return {
                msgHub: new Vue(),
                //TODO 使用栈
                editors: [],
                activeEditor: null,
                maxIndicateCharNum: 15,
                defaultIndicateWidth: 30,
                eachCharWidth: 14,
                saveDialog: {
                    visible: false,
                    save: null,
                    donotSave: null
                },
                editorRefs: {},
            }
        },
        computed: {

            _domain: {
                get(){
                    return this.domain;
                },
                set(e){
                    this.domain = e;
                }
            },
            collapsedEditorNum(){
                let num = 0;
                this.editors.forEach(function (editor) {
                    if (editor.collapse) {
                        num++;
                    }
                });
                return num;
            }
        },
        methods: {
            /**
             * 根据item获取editor
             * @param model
             * @returns {*}
             */
            getEditor: function (model) {
                for (let i = 0; i < this.editors.length; i++) {
                    let editor = this.editors[i];
                    if (model.path === editor.file.path) {
                        return editor;
                    }
                }
                return null;
            },
            removeEditorFromEditors: function (model) {
                for (let i = 0; i < this.editors.length; i++) {
                    let editor = this.editors[i];
                    if (model.path === editor.file.path) {
                        this.editors.splice(i, 1);
                        break;
                    }
                }
            },
            closeEditor: function (model) {
                let self = this;
                let editor = this.getEditor(model);
                if (editor) {
                    if (editor.isDirty()) {
                        this.saveDialog.visible = true;
                        this.saveDialog.save = function () {
                            let dtd = self.saveEditor();
                            if (dtd) {
                                dtd.done(function () {
                                    if (!editor.isDirty()) {
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
                    } else {
                        this._doCloseEditor(model);
                        editor.$destroy();
                    }
                }
            },
            _doCloseEditor: function (model) {
                if (this.activeEditor && (this.activeEditor.file.path === model.path)) {
                    this.activeEditor = null;
                }
                let editorElement = this.getEditorElement(model.path);
                editorElement.remove();
                let editorIndicate = this.getEditorIndicate(model.path);
                editorIndicate.remove();
                this.removeEditorFromEditors(model);
                if (this.editors.length > 0) {
                    let nextEditor = this.editors[0].file;
                    this.showEditor(nextEditor);
                }
            },
            showEditor: function (model) {
                if (this.activeEditor && (this.activeEditor.file.path === model.path)) {
                    return this.activeEditor;
                }
                this.unActiveAllEditors();
                let needShowedEditor = this.getEditor(model);
                if (needShowedEditor) {
                    let new_path = this.revisePath(model.path);
                    this.unActiveAllEditors();
                    let $li = $("[href='#" + new_path + "']").parent();
                    $li.attr("class", "editor-tab-active");
                    $li.css("display", "block");
                    let editor = $('#' + new_path);
                    editor.css('display', 'block');
                    this.removeEditorFromEditors(model);
                    this.editors.unshift(needShowedEditor);
                    this.activeEditor = needShowedEditor;
                    this.activeEditor.collapse = false;
                    this.activeEditor.focus();
                    while (this.needCollapse()) {
                        this.emptyOutEditorIndicate();
                    }
                    return this.activeEditor;
                }
                return null;
            },
            resetSaveDialog(){
                this.saveDialog.visible = false;
                this.saveDialog.save = null;
                this.saveDialog.donotSave = null;
            },
            unActiveAllEditors(){
                this.hideAllEditor();
                this.unActiveAllTabIndicate();
            },
            getActiveEditor: function () {
                return this.activeEditor;
            },
            needCollapse(){
                let allLiWidth = 0;
                let $lis = this.PAGE_INDICATE.find("li");
                for (let i = 0; i < $lis.length; i++) {
                    if ($lis[i].style.display != 'none') {
                        allLiWidth += ( $lis[i].clientWidth + 2);
                    }
                }
                let indicateWidth = this.PAGE_INDICATE.width();
                indicateWidth -= this.PAGE_COLLAPSE_BUTTON.width();
                if (allLiWidth > indicateWidth) {
                    return true;
                }
                return false;
            },
            applyOpenEditorService(domain, model, maximize = false){
                IDE.shade.open();
                IDE.socket.emit("getFile", {
                    type: domain,
                    event: 'getFile',
                    data: {
                        path: model.path
                    }
                }, (result) => {
                    IDE.shade.hide();
                    if (result.state === 'success') {
                        if (!model.isParent) {
                            let editor = this.openEditor(model, result.data);
                            if (editor && maximize) {
                                editor.$children[0].$emit('maximize');
                            }
                        }
                    } else {
                        debug.error('open editor, ' + result);
                    }
                });
            },
            openEditor: function (item, input) {
                let model;
                if (item.$el) {
                    model = item.model;
                } else
                    model = item;
                let oldEditor = this.getEditor(model);
                if (oldEditor) {
                    return this.showEditor(model);
                }
                return this.doOpenEditor(model, input);
            },
            doOpenEditor: function (model, content) {
                let resId = model.resId;
                if (resId == null)
                    resId = model.path.substr(model.path.lastIndexOf('.') + 1);
                let editorDecorator = this.getEditorDecorator(resId);
                if (!editorDecorator) {
                    debug.error("can not found editorDecorator with : " + resId);
                    return;
                }
                this.unActiveAllEditors();
                let newEditor = new Vue(editorDecorator);
                if (!newEditor.hasOwnProperty("input") || !newEditor.hasOwnProperty("file") || !newEditor.hasOwnProperty("msgHub")) {
                    debug.error("$props must has this properties : input,file,msgHub");
                    return;
                }
                if (!$.isFunction(newEditor.isDirty) || !$.isFunction(newEditor.save)
                    || !$.isFunction(newEditor.focus) || !$.isFunction(newEditor.dirtyStateChange)
                    || !$.isFunction(newEditor.getPartName)) {
                    debug.error("editor must has this methods : isDirty,save,focus,dirtyStateChange,getPartName");
                    return;
                }
                newEditor.$props.input = content;
                newEditor.$props.file = model;
                newEditor.$props.msgHub = this.msgHub;
                newEditor.$props.domain = this.domain;
                let editorName = this.getIndicateName(newEditor.getPartName());
                let indicateWidth = this.getIndicateWidth(editorName);
                //创建tab-indicator
                let path = this.revisePath(model.path);
                let templateI = `<li style="width:${indicateWidth}px;" class="editor-tab-active">
                                    <span href="#${path}">
                                        ${editorName}
                                        <div class="editor-tab-delete"></div>
                                    </span>
                                </li>`;
                let $li = $(templateI);
                $li.click((function (model, self) {
                    return function () {
                        self.showEditor(model);
                    }
                })(model, this));
                $li.contextmenu((function (model, edtiorPart) {
                    return function ($event) {
                        $event.preventDefault();
                        edtiorPart.openIndicatorMenu($event, model);
                    }
                })(model, this));
                let $close = $li.find('.editor-tab-delete');
                $close.click((function (model, vue) {
                    return function () {
                        vue.closeEditor(model);
                    }
                })(model, this));
                this.PAGE_INDICATE.append($li);
                //创建tab-container
                let templateE = `<div id="${path}">
                                    <div id="editor"></div>
                                 </div>`
                let $div = $(templateE);
                this.PAGE_CONTENT.append($div);
                newEditor.$mount('#' + path + " #editor");
                this.activeEditor = newEditor;
                while (this.needCollapse()) {
                    this.emptyOutEditorIndicate();
                }
                this.editors.unshift(newEditor);
                return newEditor;
            },
            emptyOutEditorIndicate: function () {
                for (let i = this.editors.length - 1; i > 0; i--) {
                    let lastEditor = this.editors[i];
                    let lastEditorIndicate = this.getEditorIndicate(lastEditor.file.path);
                    if (lastEditorIndicate.css('display') != 'none') {
                        lastEditorIndicate.css('display', 'none');
                        lastEditor.collapse = true;
                        break;
                    }
                }
            },
            getEditorDecorator: function (resId) {
                if (this.editorRefs[this._domain] == null)
                    this.editorRefs[this._domain] = require('../' + this._domain + '/config/editor.js');
                return this.editorRefs[this._domain][resId];
            },
            revisePath: function (path) {
                return path.replace(/(\/)/g, "_").replace(/(\.)/, "-");
            }
            ,
            getIndicateWidth: function (name) {
                let num = 0;
                for (let i = 0; i < name.length; i++) {
                    let c = name.charCodeAt(i);
                    if (c >= 0 && c <= 128)
                        num += 1;
                    else
                        num += 2;
                }
                if (num < 4) {
                    return this.defaultIndicateWidth;
                }
                if (num > this.maxIndicateCharNum) {
                    num = this.maxIndicateCharNum;
                }
                return num * this.eachCharWidth;
            }
            ,
            getIndicateName: function (name) {
                if (name.length > this.maxIndicateCharNum) {
                    name = name.substring(0, this.maxIndicateCharNum);
                    name += "...";
                }
                return name;
            }
            ,
            /**
             * 打开收缩editors的右键菜单
             */
            openCollapseMenu: function ($event) {
                let self = this;
                let collMenuItems = [];
                this.editors.forEach((editor) => {
                    if (editor.collapse) {
                        let file = editor.file;
                        let partName = editor.getPartName();
                        let item = {
                            id: file.path,
                            name: partName,
                            type: 'item',
                            handler: function () {
                                self.showEditor(editor.file);
                            }
                        }
                        collMenuItems.push(item);
                    }
                });
                IDE.contextmenu.setItems(collMenuItems);
                IDE.contextmenu.show($event.x - 250, $event.y);
            }
            ,
            /**
             * 打开头标签的右键菜单
             */
            openIndicatorMenu: function ($event, model) {
                this.showEditor(model);
                IDE.contextmenu.setItems(editorPartTab);
                IDE.contextmenu.show($event.clientX, $event.clientY, this.activeEditor);
            }
            ,
            /**
             * 隐藏所有editor
             */
            hideAllEditor: function () {
                for (let i = 0; i < this.editors.length; i++) {
                    let editor = this.editors[i];
                    editor.collapse = false;
                    if (editor.$el.parentNode.style.display != 'none') {
                        editor.$el.parentNode.style.display = 'none';
                    }
                }
            }
            ,
            /**
             * 把所有头标签设置为不活动状态
             */
            unActiveAllTabIndicate: function () {
                let indicates = $('.editor-tab-active');
                for (let i = 0; i < this.editors.length; i++) {
                    let editor = this.editors[i];
                    let indicate = this.getEditorIndicate(editor.file.path);
                    indicate.removeClass();
                    indicate.css('display', 'block');
                    indicate.addClass('editor-tab-unactive');
                }
            }
            ,
            /**
             *获取editor头标签
             */
            getEditorIndicate: function (path) {
                let p = this.revisePath(path);
                return $("li span[href='#" + p + "']").parent();
            }
            ,
            /**
             * 获取editor的Element
             * @param path
             * @returns {jQuery|HTMLElement}
             */
            getEditorElement: function (path) {
                let p = this.revisePath(path);
                return $("#" + p);
            }
            ,
            saveEditor(editor)
            {
                let that = this;
                if (editor && editor.isDirty() && editor.save()) {
                    let dtd = $.Deferred();
                    IDE.socket.emit("saveFile", {
                        type: that._domain,
                        path: editor.file.path,
                        content: editor.input,
                        event: 'saveFile',
                    }, function (result) {
                        if (result) {
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
            }
        },
        mounted()
        {
            if (this.$route.params) {
                let path = this.$route.params.path;
                let type = this.$route.params.type;
                let ticket = this.$route.params.ticket;
                let domain = this.$route.params.domain;
                //TODO 需要加入验证代码
//                if(ticket)
//                IDE.services(domain).checkTicket(ticket);
                if (path && type && domain) {
                    this._domain = domain;
                    setTimeout(() =>
                            this.applyOpenEditorService(domain, IDE.services(domain).parseToPath(path, type), true),
                        100);
                }
            }
            this.PAGE_INDICATE = $("#editors-indicate");
            this.PAGE_CONTENT = $("#editors-content");
            this.PAGE_COLLAPSE_BUTTON = $("#editors-indicate .editors-collapse");

            let km = new KeyManager();
            km.bind('ctrl+s',{
                keydown:() => {
                    this.saveEditor(this.activeEditor);
                }
            });
            IDE.keyManager.watchPage(this.$el,km);
        }
        ,
        beforeDestory: function () {
            this.msgHub.$destroy();
            IDE.keyManager.unwatchPage(this.$el);
        }
    }
</script>