<template>
    <div class="ide_root">
        <menubar id="ide_menu" ref="ide_menu" :menuData="menuData"></menubar>
        <toolbar class="top_toolbar" :config="toolbarConfig" :toolitems="toolItems"
                 style="border: 1px solid;float: right;width: 100%"></toolbar>

        <div id="ide_workbench">
            <fastbar id="left_fast_bar" :items="views.left" :direction='vertical'></fastbar>
            <workbench id="ide_workbench_center" :views="views" ref="workbench"
                       :domain="afe"></workbench>
            <fastbar id="right_fast_bar" :items="views.right" :direction='vertical'></fastbar>
        </div>
        <fastbar id="bottom_fast_bar" :items="views.bottom" :direction='horizontal'></fastbar>
        <contextMenu ref="ide_contextMenu" style="display: none;position: absolute" id="contextMenu"
                     :items="naviContextMenuItems"
                     :config="contextMenuConfig"
        ></contextMenu>

        <shade ref="ide_shade"></shade>

        <span id="__RULER" style="visibility: hidden; white-space: nowrap;">test</span>
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
    import shade from "../components/shade.vue";
    import toolbar from "../components/toolbar.vue"
    import IDESocket from "../../core/IDESocket"
    import navContextMenus from '../../action/afe.navi.contextmenu';
    import menuData from '../../action/afe.menu';
    import parameter from '../../views/afe/components/dialog/configParameter.vue'
    import connToServer from '../../views/afe/components/dialog/connToTheServer.vue'


    String.prototype.textLength = function () {
        let ruler = $("#__RULER");
        ruler.text(this);
        return ruler[0].offsetWidth;
    };
    export default{
        data(){
            var self = this;
            return {
                vertical: false,
                horizontal: true,
                pageName: "pageName",
                naviContextMenuItems: [],
                contextMenuConfig: {},
                toolItems: [
                    {
                        id: 'item1',
                        desp: 'desp1',
                        type: 'item',
                        img: "/assets/image/nav-folder.png"
                    },
                    {
                        type: 'separator',
                    },
                    {
                        id: 'item2',
                        desp: 'desp2',
                        type: 'item',
                        img: "/assets/image/nav-folder.png"
                    }, {
                        id: 'item3',
                        desp: 'desp3',
                        type: 'group',
                        img: '/assets/image/nav-folder.png',
                        children: [
                            {
                                id: "031",
                                desp: 'desp2',
                                name: "011",
                                img: '/assets/image/nav-folder.png',
                                type: 'item',
                            }, {
                                id: "031",
                                desp: 'desp2',
                                name: "011",
                                img: '/assets/image/nav-folder.png',
                                type: 'item',
                            }
                        ]
                    },
                    {
                        id: 'item4',
                        desp: 'desp4',
                        type: 'item',
                        img: "/assets/image/nav-folder.png"
                    },
                    {
                        type: 'separator',
                    },
                    {
                        id: 'item5',
                        desp: 'desp5',
                        type: 'item',
                        img: "/assets/image/nav-folder.png"
                    }
                ],
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
                menuData: menuData,
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
                                    item.model.children = result.data;
                                } else {
                                    for (let i = 0; i < newChildren.length; i++) {
                                        let newChd = newChildren[i];
                                        let exist = false;
                                        for (let j = 0; j < oldChildren.length; j++) {
                                            let oldChd = oldChildren[j];
                                            if (newChd.path === oldChd.path) {
                                                exist = true;
                                                oldChd['##keep##'] = true;
                                                break;
                                            }

                                        }
                                        if (!exist) {
                                            newChd['##keep##'] = true;
                                            oldChildren.push(newChd);
                                        }
                                    }
                                    for (let i = 0; i < oldChildren.length; i++) {
                                        let oldChd = oldChildren[i];
                                        if (!oldChd['##keep##']) {
                                            oldChildren.splice(i, 1);
                                            i--;
                                        }
                                        delete oldChd['##keep##'];
                                    }
                                }
                            } else {
                                debug.error('refresh resources fail , ' + result);
                            }
                        }
                    );
                },
                afterDelete: function (item) {
                    var editor = IDE.editorPart.getEditor(item);
                    if (editor) {
                        IDE.editorPart.closeEditor(item);
                    }
                    let def = IDE.socket.emitAndGetDeferred('deleteFile', {
                        type:IDE.type,
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
                    var item = this;
                    if (!item.model.isParent) {
                        let editor = IDE.editorPart.getEditor(item);
                        if (editor) {
                            IDE.editorPart.showEditor(item);
                            return;
                        }
                        IDE.shade.open();
                        IDE.socket.emit("getFile", {
                            type: IDE.type,
                            event: 'getFile',
                            data: {
                                path: item.model.path
                            }
                        }, function (result) {
                            IDE.shade.hide();
                            if (result.state === 'success') {
                                if (!item.model.isParent) {
                                    IDE.editorPart.openEditor(item, result.data);
                                }
                            } else {
                                debug.error('resource dbclick , ' + result);
                            }
                        });
                    }
                },
                rightClick: function (event) {
                    var item = this;
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
                },
                filter: function (item) {
                    if (item.model.name) {
                        if (item.model.name.startsWith(".")) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        },
        methods: {},
        mounted(){
            var self = this;
            IDE.type = 'afe';
            IDE.contextmenu = self.$refs.ide_contextMenu;
            IDE.shade = self.$refs.ide_shade;
            IDE.menu = self.$refs.ide_menu;
        },
        beforeCreate(){
            var self = this;
            window.viewRegistry = {
                'navigator': {
                    name: '导航器',
                    component: './tree.vue',
                    init(callback){
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
                            asyncLoadItem:this.asyncLoadItem,
                            afterDelete:this.afterDelete,
                            click:this.click,
                            dblclick:this.dblclick,
                            rightClick:this.rightClick,
                            filter:this.filter
                        },
                    },
                    image: "/assets/image/nav-folder.png",
                    actions: [
                        {
                            id: 'linkWithEditorAction',
                            name: "linkWithEditor",
                            type: 'item',
                            img: '/assets/image/file_awb.gif',
                            tooltip: "LinkWithEditor",
                            validate(){
                                return true;
                            },
                            onclick(selection){
                                let editor = IDE.editorPart.getActiveEditor();
                                if (editor) {
                                    IDE.navigator.setSelection(editor.file);
                                }
                            }
                        }
                    ],
                    propertyPage: {
                        component: './table.vue',
                        selectionChanged(){
                        },
                        match(selection){
                            return '';
                        }
                    }
                },
                'properties': {
                    name: '属性',
                    image: "/assets/image/nav-folder.png",
                    init(){
                        WORKBENCH.property = this;
                    },
                    data: {
                        toolItems: [
                            {
                                id: 'item1',
                                desp: 'desp1',
                                type: 'item',
                                img: "/assets/image/nav-folder.png"
                            },
                            {
                                type: 'separator',
                            },
                            {
                                id: 'item2',
                                desp: 'desp2',
                                type: 'item',
                                img: "/assets/image/nav-folder.png"
                            }, {
                                id: 'item3',
                                desp: 'desp3',
                                type: 'group',
                                img: '/assets/image/nav-folder.png',
                                children: [
                                    {
                                        id: "031",
                                        desp: 'desp2',
                                        name: "011",
                                        img: '/assets/image/nav-folder.png',
                                        type: 'item',
                                    }, {
                                        id: "031",
                                        desp: 'desp2',
                                        name: "011",
                                        img: '/assets/image/nav-folder.png',
                                        type: 'item',
                                    }
                                ]
                            },
                            {
                                id: 'item4',
                                desp: 'desp4',
                                type: 'item',
                                img: "/assets/image/nav-folder.png"
                            },
                            {
                                type: 'separator',
                            },
                            {
                                id: 'item5',
                                desp: 'desp5',
                                type: 'item',
                                img: "/assets/image/nav-folder.png"
                            }
                        ]
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
            editorpage: editorPage,
            contextMenu: contextMenu,
            shade: shade,
            toolbar: toolbar,
            fastbar: fastbar,
            statusbar: statusbar,
            viewpart: view,
            workbench: workbench,
            verifyFileEditor: verifyFileEditor
        }
    }
</script>