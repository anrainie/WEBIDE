<template>
    <div class="ide_root">
        <menubar v-if="showMenuBar" id="ide_menu" ref="ide_menu" :menu_data="menuData"></menubar>
        <toolbar class="top_toolbar" :config="toolbarConfig" :toolitems="toolItems"
                 style="border: 1px solid;float: right;width: 100%"></toolbar>

        <div id="ide_workbench">
            <fastbar v-if="showFastBarLeft" id="left_fast_bar" :items="views.left" :direction='vertical'></fastbar>
            <workbench v-if="showWorkbench" id="ide_workbench_center" domain="afa" :views="views" ref="workbench"></workbench>
            <fastbar v-if="showFastBarRight" id="right_fast_bar" :items="views.right" :direction='vertical'></fastbar>
        </div>
        <fastbar v-if="showFastBarBottom" id="bottom_fast_bar" :items="views.bottom" :direction='horizontal'></fastbar>
        <contextmenu ref="ide_contextMenu" style="display: none;position: absolute" id="contextMenu"
                     :items="naviContextMenuItems"
                     :config="contextMenuConfig"
        ></contextmenu>
    </div>
</template>
<style>
    @import "~bootstrap/dist/css/bootstrap.css";

    #left_fast_bar {
        display: inline-block;
        width: 25px;
        height: 100%;
        float: left;
        background: #DDD;
    }

    #ide_workbench_center {
        width: -moz-calc(100% - 50px);
        width: -webkit-calc(100% - 50px);
        width: calc(100% - 50px);
    }

    #bottom_fast_bar {
        bottom: 0px;
        width: 100%;
        /*height: 25px;*/
        background: #DDD;
    }

    #right_fast_bar {
        display: inline-block;
        width: 25px;
        height: 100%;
        float: right;
        background: #DDD;
        padding: 0;
    }

    #ide_workbench {
        display: inline-block;
        width: 100%;
        height: -moz-calc(100% - 60px);
        height: -webkit-calc(100% - 60px);
        height: calc(100% - 60px);
    }

    #ide_navigator {
        position: relative;
        border: 1px solid gray;
        height: 100%;
    }

    #ide_EDITOR_PART {
        height: 100%;
    }
</style>
<script>
    import "jquery";
    import "bootstrap";
    import "ztree";
    import axios from 'axios';
    import fastbar from "../components/fastbar.vue";
    import view from "../components/viewPart.vue";
    import statusbar from "../components/statusbar.vue";
    import workbench from "../components/workbench.vue";
    import navi from "../components/tree.vue";
    import menu from "../components/menubar.vue";
    import editorPage from "../components/editorPart.vue";
    import contextMenu from "../components/contextMenu.vue";
    import toolbar from "../components/toolbar.vue"
    import navContextMenus from '../../action/afa.navi.contextmenu';
    import menuData from '../../action/afa.menu';



    export default{
        data(){
            let self = this;
            return {
                showFastBarLeft: true,
                showFastBarRight: true,
                showFastBarBottom: true,
                showMenuBar: true,
                showWorkbench: true,
                vertical: false,
                horizontal: true,
                pageName: "pageName",
                naviContextMenuItems: [],
                contextMenuConfig: {},
                toolItems: [],
                toolbarConfig: {
                    onclick: function (item) {
                        console.info("toolbar item onclick : " + item.id);
                    },
                    direction: 'left'
                },
                views: {
                    left: [{
                        id: 'navigator',
                        subgroup: 0,
                        open: true,
                    }, {
                        id: 'properties',
                        subgroup: 1,
                        open: false,
                    }, {
                        id: 'error',
                        subgroup: 1,
                        open: false,
                    }],
                    right: [{
                        id: 'console',
                        subgroup: 1,
                        open: false,
                    }, {
                        id: 'version',
                        subgroup: 0,
                        open: false,
                    }],
                    bottom: [{
                        id: 'problem',
                        subgroup: 1,
                        open: false,
                    }]
                },
                menuData: menuData
            }
        },
        methods: {
        },
        created(){
        },
        mounted(){
            //注册服务
            require('./config/services.js');

            let self = this;
            IDE.type = 'afa';
            IDE.contextmenu = self.$refs.ide_contextMenu;
            IDE.menu = self.$refs.ide_menu;
//            IDE.socket = new IDESocket();
            IDE.socket.getSocket('afa');
        },
        beforeCreate(){
            let self = this;
            window.viewRegistry = {
                'navigator': {
                    name: '导航器',
                    component: './tree.vue',
                    init(callback){
                        console.log('init navigator');
                        IDE.shade.open();
                        IDE.socket.emit('getNaviItems', {
                            type: IDE.type,
                            event: 'getNaviItems',
                            data: {
                                path: '\\',
                                level: 1
                            }
                        }, function (result) {
                            if (result) {
                                let naviItems = [];
                                if (result.state === 'success') {
                                    for (let index in result.data) {
                                        naviItems.push(result.data[index]);
                                    }
                                    callback(naviItems);
                                } else {
                                    debug.error('emit getNaviItems fail , ' + result.errorMsg);
                                }
                            }
                            IDE.shade.hide();
                        });
                    },
                    data: {
                        config: {
                            width: '100%',
                            check: false,
                            async: true,
                            callback: {
                                asyncLoadItem: function (item, level) {
                                    if (!level) {
                                        level = 1
                                    }
                                    IDE.socket.emit('getNaviItems', {
                                            type: IDE.type,
                                            event: 'getNaviItems',
                                            data: {
                                                path: item.model.path,
                                                level: level
                                            }
                                        }, function (result) {
                                            if (result.state === 'success') {
                                                let oldChildren = item.model.children
                                                let newChildren = result.data
                                                if (!oldChildren || oldChildren.length == 0) {
                                                    item.model.children = result.data
                                                } else {
                                                    combine(newChildren, oldChildren,level)
                                                }
                                            } else {
                                                debug.error('refresh resources fail , ' + result)
                                            }

                                            //合并文件，不存在的文件删除，已存在的文件保留并对比其children。
                                            function combine(newChildren, oldChildren,level) {
                                                newChildren = newChildren || [];
                                                oldChildren = oldChildren || [];
                                                for (let i = 0; i < newChildren.length; i++) {
                                                    let newChd = newChildren[i];
                                                    let exist = false;
                                                    for (let j = 0; j < oldChildren.length; j++) {
                                                        let oldChd = oldChildren[j];
                                                        if (newChd.path === oldChd.path) {
                                                            exist = true;
                                                            oldChd['##keep##'] = true;
                                                            if( (level - 1) > 0) {
                                                                combine(newChd.children, oldChd.children,level - 1);
                                                            }
                                                            break;
                                                        }
                                                    }
                                                    if (!exist) {
                                                        newChd['##keep##'] = true;
                                                        oldChildren.push(newChd);
                                                    }
                                                }
                                                for (var i = 0; i < oldChildren.length; i++) {
                                                    var oldChd = oldChildren[i];
                                                    if (!oldChd['##keep##']) {
                                                        oldChildren.splice(i, 1);
                                                        i--;
                                                    }
                                                    delete oldChd['##keep##'];
                                                }
                                            }
                                        }
                                    )
                                },
                                delete: function (item) {
                                    let editor = IDE.editorPart.getEditor(item);
                                    if (editor) {
                                        IDE.editorPart.closeEditor(item);
                                    }
                                    let def = IDE.socket.emitAndGetDeferred('deleteFile', {
                                        path: item.model.path
                                    }).done(function (result) {
                                        item.getParent().refresh();
                                    }).fail(function (error) {
                                        debug.error('delete resource fail , ' + error);
                                    });
                                },

                                click: function (item) {
                                },
                                dblclick: function () {
                                    let item = this;
                                    if (!item.model.isParent) {
                                        let editor = IDE.editorPart.getEditor(item.model);
                                        if (editor) {
                                            IDE.editorPart.showEditor(item.model);
                                            return;
                                        }
                                        IDE.editorPart.applyOpenEditorService('afa',item.model);
                                    }
                                },
                                rightClick: function (event) {
                                    let item = this;
                                    IDE.socket.emit('getNaviMenu', {
                                        type: IDE.type,
                                        event: 'getNaviMenu',
                                        data: {path: item.model.path}
                                    }, function (result) {
                                        if (result) {
                                            if (result.state === 'success') {
                                                let newItems = navContextMenus.match(result.data);
                                                IDE.contextmenu.setItems(newItems);
                                                if (IDE.contextmenu.isActive()) {
                                                    IDE.contextmenu.hide();
                                                }
                                                IDE.contextmenu.show(event.x, event.y, IDE.navigator.selection);
                                            } else {
                                                debug.error('getNaviMenu , ' + result);
                                            }
                                        }
                                    });
                                }
                            },
                            filter: function (item) {
                                if (item.model.name) {
                                    if (item.model.name.startsWith(".")) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        },
                    },
                    image: "/assets/image/nav-folder.png",
                    actions: [
                        {
                            id: 'linkWithEditorAction',
                            name: "linkWithEditor",
                            type: 'item',
                            img: '/assets/image/nav-link.png',
                            tooltip: "LinkWithEditor",
                            validate(){
                                return true;
                            },
                            onclick(selection){
                                let editor = IDE.editorPart.getActiveEditor();
                                if (editor) {
                                    var item = IDE.navigator.getItem(editor.file.path);
                                    IDE.navigator.setSelection(item);
                                }
                            }
                        }
                    ]
                },
                'properties': {
                    name: '属性',
                    image: "/assets/image/nav-folder.png",
                    init(){
                        WORKBENCH.property = this;
                    }
                },
                'console': {
                    name: '控制台',
                    image: "/assets/image/nav-folder.png",
                },
                'error': {
                    name: '错误控制',
                    image: "/assets/image/nav-folder.png",
                },
                'problem': {
                    name: '问题',
                    image: "/assets/image/nav-folder.png",
                },
                'version': {
                    name: '版本',
                    image: "/assets/image/nav-folder.png",
                }
            };
        },
        components: {
            menubar: menu,
            navigator: navi,
            editorPage: editorPage,
            contextmenu: contextMenu,
            toolbar: toolbar,
            fastbar: fastbar,
            statusbar: statusbar,
            viewpart: view,
            workbench: workbench
        }
    }
</script>