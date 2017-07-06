<template>
    <div class="ide_root">
        <menubar id="ide_menu" ref="ide_menu" :menuData="menuData"></menubar>
        <toolbar class="top_toolbar" :config="toolbarConfig" :toolItems="toolItems"
                 style="border: 1px solid;float: right;width: 100%"></toolbar>

        <div id="ide_workbench">
            <fastbar id="left_fast_bar" :items="views.left" :direction='vertical'></fastbar>
            <workbench id="ide_workbench_center" :views="views" ref="workbench" :editors="editors"></workbench>
            <fastbar id="right_fast_bar" :items="views.right" :direction='vertical'></fastbar>
        </div>
        <fastbar id="bottom_fast_bar" :items="views.bottom" :direction='horizontal'></fastbar>
        <contextMenu ref="ide_contextMenu" style="display: none;position: absolute" id="contextMenu"
                     :items="naviContextMenuItems"
                     :config="contextMenuConfig"
        ></contextMenu>

        <shade ref="ide_shade"></shade>
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
    import flowEditor from "../components/floweditor.vue";
    import contextMenu from "../components/contextMenu.vue";
    import shade from "../components/shade.vue";
    import toolbar from "../components/toolbar.vue"
    import io from 'socket.io-client';
    import navContextMenus from '../../action/afa.navi.contextmenu';
    import menuData from '../../action/ide.menu';
    import debug from '../../utils/debug';

    window.debug = debug;

    var naviItems = [];
    export default{
        data(){
            var self = this;
            return {
                editors: {},
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
                        img: "assets/image/nav-folder.png"
                    },
                    {
                        type: 'separator',
                    },
                    {
                        id: 'item2',
                        desp: 'desp2',
                        type: 'item',
                        img: "assets/image/nav-folder.png"
                    }, {
                        id: 'item3',
                        desp: 'desp3',
                        type: 'group',
                        img: 'assets/image/nav-folder.png',
                        children: [
                            {
                                id: "031",
                                desp: 'desp2',
                                name: "011",
                                img: 'assets/image/nav-folder.png',
                                type: 'item',
                            }, {
                                id: "031",
                                desp: 'desp2',
                                name: "011",
                                img: 'assets/image/nav-folder.png',
                                type: 'item',
                            }
                        ]
                    },
                    {
                        id: 'item4',
                        desp: 'desp4',
                        type: 'item',
                        img: "assets/image/nav-folder.png"
                    },
                    {
                        type: 'separator',
                    },
                    {
                        id: 'item5',
                        desp: 'desp5',
                        type: 'item',
                        img: "assets/image/nav-folder.png"
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
                        open: true,
                    }, {
                        id: 'error',
                        subgroup: 1,
                        open: true,
                    }],
                    right: [{
                        id: 'console',
                        subgroup: 1,
                        open: true,
                    }, {
                        id: 'version',
                        subgroup: 0,
                        open: true,
                    }],
                    bottom: [{
                        id: 'problem',
                        subgroup: 1,
                        open: true,
                    }, {
                        id: 'test1',
                        subgroup: 0,
                        open: true,
                    }, {
                        id: 'test2',
                        subgroup: 0,
                        open: true,
                    }]
                },
                menuData:menuData
            }
        },
        methods: {},
        mounted(){
            var self = this;

            IDE.type = 'afa';
            IDE.contextmenu = self.$refs.ide_contextMenu;
            IDE.shade = self.$refs.ide_shade;
            IDE.menu = self.$refs.ide_menu;

            let first = true;

            let socket = io("http://localhost:8080");
            socket.on('connect_error', function (err) {
                console.info('connect_error');
                IDE.socket = null;
            });

            socket.on('connect', function () {
                if (first) {
                    IDE.shade.open();
                    IDE.socket.emit('getNaviItems', {
                        type: IDE.type,
                        event: 'getNaviItems',
                        data: {
                            path: '\\',
                            level: 1
                        }
                    }, function (data) {
                        if (data) {
                            let result = JSON.parse(data);
                            if (result.state === 'success') {
                                for (let index in result.data) {
                                    naviItems.push(result.data[index]);
                                }
                            } else {
                                console.info('emit getNaviItems : ', result.errorMsg);
                            }
                        }
                        IDE.shade.hide();
                    });
                    first = false;
                }
            });

            socket.on('reconnect_error', function (data) {
                console.info("reconnect_error:", data);
            })

            IDE.socket = socket;

        },
        beforeCreate(){
            var self = this;
            window.viewRegistry = {
                'navigator': {
                    name: '导航器',
                    component: './tree.vue',
                    data: {
                        config: {
                            check: false,
                            async: true,
                            callback: {
                                asyncLoadItem: function (item) {
                                    IDE.socket.emit('getNaviItems', {
                                        type: IDE.type,
                                        event: 'getNaviItems',
                                        data: {
                                            path: item.model.path,
                                            level: 1
                                        }
                                    }, function (data) {
                                        let result = JSON.parse(data);
                                        if (result.state === 'success') {
                                            let oldChildren = item.model.children.concat([]);
                                            for (let index in result.data) {
                                                let newChild = result.data[index];
                                                //如果已存在的子元素，被删除的子元素都不做处理
                                                if(!item.getChild(newChild.name)) {
                                                    item.addChild(result.data[index]);
                                                }
                                            }
                                        } else {
                                            console.info(result);
                                        }
                                    });
                                },
                                delete: function (item) {
                                    var editor = IDE.editorPart.getEditor(item);
                                    if (editor) {
                                        IDE.editorPart.closeEditor(item);
                                    }
                                },
                                click: function (item) {
                                },
                                dblclick: function (item) {
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
                                        }, function (data) {
                                            let result = JSON.parse(data);
                                            console.info("getFile：", result);
                                            if (!item.model.isParent) {
                                                IDE.editorPart.openEditor(item, result.data);
                                            }
                                            IDE.shade.hide();
                                        })

                                    }
                                },
                                rightClick: function (event, item) {
                                    IDE.socket.emit('getNaviMenu', {
                                        type: IDE.type,
                                        event: 'getNaviMenu',
                                        data: {path: item.model.path}
                                    }, function (data) {
                                        if (data) {
                                            let result = JSON.parse(data);
                                            if (result.state === 'success') {
                                                let newItems = navContextMenus.match(result.data);
                                                IDE.contextmenu.setItems(newItems);
                                                if (IDE.contextmenu.isActive()) {
                                                    IDE.contextmenu.hide();
                                                }
                                                IDE.contextmenu.show(event.x, event.y);
                                            } else {
                                                console.info('getNaviMenu : ', result.errorMsg);
                                            }
                                        }
                                    });
                                }
                            },
                            filter: function (item) {
                                if (item.model.name.startsWith(".")) {
                                    return true;
                                }
                                return false;
                            }
                        },
                        model: naviItems
                    },
                    image: "assets/image/nav-folder.png",
                    actions: {
                        collapse: {
                            onclick(){
                                console.log(collapse);
                            },
                            validate(){
                                return false;
                            }
                        }
                    }
                },
                'properties': {
                    name: '属性',
                    image: "assets/image/nav-folder.png",
                    data: {
                        toolItems: [
                            {
                                id: 'item1',
                                desp: 'desp1',
                                type: 'item',
                                img: "assets/image/nav-folder.png"
                            },
                            {
                                type: 'separator',
                            },
                            {
                                id: 'item2',
                                desp: 'desp2',
                                type: 'item',
                                img: "assets/image/nav-folder.png"
                            }, {
                                id: 'item3',
                                desp: 'desp3',
                                type: 'group',
                                img: 'assets/image/nav-folder.png',
                                children: [
                                    {
                                        id: "031",
                                        desp: 'desp2',
                                        name: "011",
                                        img: 'assets/image/nav-folder.png',
                                        type: 'item',
                                    }, {
                                        id: "031",
                                        desp: 'desp2',
                                        name: "011",
                                        img: 'assets/image/nav-folder.png',
                                        type: 'item',
                                    }
                                ]
                            },
                            {
                                id: 'item4',
                                desp: 'desp4',
                                type: 'item',
                                img: "assets/image/nav-folder.png"
                            },
                            {
                                type: 'separator',
                            },
                            {
                                id: 'item5',
                                desp: 'desp5',
                                type: 'item',
                                img: "assets/image/nav-folder.png"
                            }
                        ]
                    }
                },
                'console': {
                    name: '控制台',
                    image: "assets/image/nav-folder.png",
                },
                'error': {
                    name: '错误控制',
                    image: "assets/image/nav-folder.png",
                },
                'problem': {
                    name: '问题',
                    image: "assets/image/nav-folder.png",
                },
                'version': {
                    name: '版本',
                    image: "assets/image/nav-folder.png",
                },
                'test1': {
                    name: '测试1',
                    image: "assets/image/nav-folder.png",
                },
                'test2': {
                    name: '测试2',
                    component: './table.vue',
                    image: "assets/image/nav-folder.png",
                },
                'test3': {
                    name: '测试3',
                    image: "assets/image/nav-folder.png",
                }
            };
        },
        components: {
            menubar: menu,
            navigator: navi,
            editorPage: editorPage,
            contextMenu: contextMenu,
            shade: shade,
            toolbar: toolbar,
            fastbar: fastbar,
            statusbar: statusbar,
            viewpart: view,
            workbench: workbench,
        }
    }
</script>