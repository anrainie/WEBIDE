<template>
    <div>
        <menubar id="ide_menu" ref="ide_menu" :menuData="menuData"></menubar>
        <toolbar :config="toolbarConfig" :toolItems="toolItems" style="border: 1px solid;float: right;width: 100%"></toolbar>

        <div id="ide_workbench">
            <fastbar id="left_fast_bar" :items="views.left" :direction='vertical'></fastbar>
            <workbench :views="views" ref="workbench" :editors="editors"></workbench>
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
        width: 2%;
        height: 100%;
        float: left;
        background: #DDD;
    }
    #bottom_fast_bar {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 25px;
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
    }
    #ide_navigator {
        position: relative;
        border: 1px solid gray;
        height: 100%;
    }
    #ide_workbenchPage {
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

    var naviItems = [
        {
            "children": [
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "name": "documentInterface",
                                    "path": "/dataModule/dataInterface/bank/documentInterface",
                                    "resId": "documentInterface",
                                    "isParent":true
                                },
                                {
                                    "name": "messageInterface",
                                    "path": "/dataModule/dataInterface/bank/messageInterface",
                                    "resId": "messageInterface",
                                    "isParent":true
                                }
                            ],
                            "name": "bank",
                            "path": "/dataModule/dataInterface/bank",
                            "resId": "bank",
                            "isParent":true
                        },
                        {
                            "name": "output",
                            "path": "/dataModule/dataInterface/output",
                            "resId": "output",
                            "isParent":true
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "documentInterface",
                                                    "path": "/dataModule/dataInterface/projects/hello/heii/documentInterface",
                                                    "resId": "documentInterface",
                                                    "isParent":true
                                                },
                                                {
                                                    "name": "messageInterface",
                                                    "path": "/dataModule/dataInterface/projects/hello/heii/messageInterface",
                                                    "resId": "messageInterface",
                                                    "isParent":true
                                                }
                                            ],
                                            "name": "heii",
                                            "path": "/dataModule/dataInterface/projects/hello/heii",
                                            "resId": "application",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "hello",
                                    "path": "/dataModule/dataInterface/projects/hello",
                                    "resId": "project",
                                    "isParent":true
                                }
                            ],
                            "name": "projects",
                            "path": "/dataModule/dataInterface/projects",
                            "resId": "projects",
                            "isParent":true
                        },
                        {
                            "name": "solutions",
                            "path": "/dataModule/dataInterface/solutions",
                            "resId": "solutions",
                            "isParent":true
                        }
                    ],
                    "name": "dataInterface",
                    "path": "/dataModule/dataInterface",
                    "resId": "dataInterface",
                    "isParent":true
                },
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "name": "dataEntities",
                                    "path": "/dataModule/dataObject/bank/dataEntities",
                                    "resId": "dataEntities",
                                    "isParent":true
                                },
                                {
                                    "name": "srcFolder",
                                    "path": "/dataModule/dataObject/bank/srcFolder",
                                    "resId": "srcFolder",
                                    "isParent":true
                                }
                            ],
                            "name": "bank",
                            "path": "/dataModule/dataObject/bank",
                            "resId": "bank",
                            "isParent":true
                        },
                        {
                            "name": "output",
                            "path": "/dataModule/dataObject/output",
                            "resId": "output",
                            "isParent":true
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "dataEntities",
                                                    "path": "/dataModule/dataObject/projects/hello/heii/dataEntities",
                                                    "resId": "dataEntities",
                                                    "isParent":true
                                                },
                                                {
                                                    "name": "srcFolder",
                                                    "path": "/dataModule/dataObject/projects/hello/heii/srcFolder",
                                                    "resId": "srcFolder",
                                                    "isParent":true
                                                }
                                            ],
                                            "name": "heii",
                                            "path": "/dataModule/dataObject/projects/hello/heii",
                                            "resId": "application",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "hello",
                                    "path": "/dataModule/dataObject/projects/hello",
                                    "resId": "project",
                                    "isParent":true
                                }
                            ],
                            "name": "projects",
                            "path": "/dataModule/dataObject/projects",
                            "resId": "projects",
                            "isParent":true
                        },
                        {
                            "name": "solutions",
                            "path": "/dataModule/dataObject/solutions",
                            "resId": "solutions",
                            "isParent":true
                        }
                    ],
                    "name": "dataObject",
                    "path": "/dataModule/dataObject",
                    "resId": "dataObject",
                    "isParent":true
                },
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "databaseModule",
                                                    "path": "/dataModule/databaseTable/projects/hello/heii/databaseModule",
                                                    "resId": "databaseModule",
                                                    "isParent":true
                                                }
                                            ],
                                            "name": "heii",
                                            "path": "/dataModule/databaseTable/projects/hello/heii",
                                            "resId": "application",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "hello",
                                    "path": "/dataModule/databaseTable/projects/hello",
                                    "resId": "project",
                                    "isParent":true
                                }
                            ],
                            "name": "projects",
                            "path": "/dataModule/databaseTable/projects",
                            "resId": "projects",
                            "isParent":true
                        },
                        {
                            "children": [],
                            "name": "solutions",
                            "path": "/dataModule/databaseTable/solutions",
                            "resId": "solutions",
                            "isParent":true
                        }
                    ],
                    "name": "databaseTable",
                    "path": "/dataModule/databaseTable",
                    "resId": "databaseTable",
                    "isParent":true
                },
                {
                    "children": [
                        {
                            "name": "bank",
                            "path": "/dataModule/datadict/bank",
                            "resId": "bank",
                            "isParent":true
                        },
                        {
                            "name": "platform",
                            "path": "/dataModule/datadict/platform",
                            "resId": "platform",
                            "isParent":true
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "name": "heii",
                                            "path": "/dataModule/datadict/projects/hello/heii",
                                            "resId": "application",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "hello",
                                    "path": "/dataModule/datadict/projects/hello",
                                    "resId": "project",
                                    "isParent":true
                                }
                            ],
                            "name": "projects",
                            "path": "/dataModule/datadict/projects",
                            "resId": "projects",
                            "isParent":true
                        },
                        {
                            "name": "solutions",
                            "path": "/dataModule/datadict/solutions",
                            "resId": "solutions",
                            "isParent":true
                        }
                    ],
                    "name": "datadict",
                    "path": "/dataModule/datadict",
                    "resId": "datadict",
                    "isParent":true
                }
            ],
            "name": "dataModule",
            "path": "/dataModule",
            "resId": "dataModule",
            "isParent":true
        },
        {
            "children": [
                {
                    "children": [
                        {
                            "name": "commonBusinessTemplate",
                            "path": "/flowModule/bank/commonBusinessTemplate",
                            "resId": "businessTemplate",
                            "isParent":true
                        },
                        {
                            "name": "commonTechnologyTemplate",
                            "path": "/flowModule/bank/commonTechnologyTemplate",
                            "resId": "technologyTemplate",
                            "isParent":true
                        },
                        {
                            "name": "commonTradeTemplate",
                            "path": "/flowModule/bank/commonTradeTemplate",
                            "resId": "tradeTemplate",
                            "isParent":true
                        }
                    ],
                    "name": "bank",
                    "path": "/flowModule/bank",
                    "resId": "bank",
                    "isParent":true
                },
                {
                    "children": [
                        {
                            "name": "commonBusinessTemplate",
                            "path": "/flowModule/platform/commonBusinessTemplate",
                            "resId": "businessTemplate",
                            "isParent":true
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": null,
                                            "name": "sf.sf",
                                            "path": "/flowModule/platform/commonTechnologyTemplate/flowInit/sf.sf",
                                            "resId": "sf"
                                        }
                                    ],
                                    "name": "flowInit",
                                    "path": "/flowModule/platform/commonTechnologyTemplate/flowInit",
                                    "resId": "flowInit",
                                    "isParent":true
                                }
                            ],
                            "name": "commonTechnologyTemplate",
                            "path": "/flowModule/platform/commonTechnologyTemplate",
                            "resId": "technologyTemplate",
                            "isParent":true
                        },
                        {
                            "name": "commonTradeTemplate",
                            "path": "/flowModule/platform/commonTradeTemplate",
                            "resId": "tradeTemplate",
                            "isParent":true
                        }
                    ],
                    "name": "platform",
                    "path": "/flowModule/platform",
                    "resId": "platform",
                    "isParent":true
                },
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "name": "commonBusinessTemplate",
                                    "path": "/flowModule/projects/hello/commonBusinessTemplate",
                                    "resId": "businessTemplate",
                                    "isParent":true
                                },
                                {
                                    "name": "commonTechnologyTemplate",
                                    "path": "/flowModule/projects/hello/commonTechnologyTemplate",
                                    "resId": "technologyTemplate",
                                    "isParent":true
                                },
                                {
                                    "name": "commonTradeTemplate",
                                    "path": "/flowModule/projects/hello/commonTradeTemplate",
                                    "resId": "tradeTemplate",
                                    "isParent":true
                                },
                                {
                                    "children": [
                                        {
                                            "name": "privateBusinessTemplate",
                                            "path": "/flowModule/projects/hello/heii/privateBusinessTemplate",
                                            "resId": "businessTemplate",
                                            "isParent":true
                                        },
                                        {
                                            "name": "privateTechnologyTemplate",
                                            "path": "/flowModule/projects/hello/heii/privateTechnologyTemplate",
                                            "resId": "technologyTemplate",
                                            "isParent":true
                                        },
                                        {
                                            "name": "privateTradeTemplate",
                                            "path": "/flowModule/projects/hello/heii/privateTradeTemplate",
                                            "resId": "tradeTemplate",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "heii",
                                    "path": "/flowModule/projects/hello/heii",
                                    "resId": "application",
                                    "isParent":true
                                }
                            ],
                            "name": "hello",
                            "path": "/flowModule/projects/hello",
                            "resId": "project",
                            "isParent":true
                        }
                    ],
                    "name": "projects",
                    "path": "/flowModule/projects",
                    "resId": "projects",
                    "isParent":true
                },
                {
                    "name": "solutions",
                    "path": "/flowModule/solutions",
                    "resId": "solutions",
                    "isParent":true
                }
            ],
            "name": "flowModule",
            "path": "/flowModule",
            "resId": "flowModule",
            "isParent":true
        },
        {
            "children": [
                {
                    "children": [
                        {
                            "name": "bank",
                            "path": "/functionModule/businessComponent/bank",
                            "resId": "bank",
                            "isParent":true
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "name": "heii",
                                            "path": "/functionModule/businessComponent/projects/hello/heii",
                                            "resId": "application",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "hello",
                                    "path": "/functionModule/businessComponent/projects/hello",
                                    "resId": "project",
                                    "isParent":true
                                }
                            ],
                            "name": "projects",
                            "path": "/functionModule/businessComponent/projects",
                            "resId": "projects",
                            "isParent":true
                        },
                        {
                            "name": "solutions",
                            "path": "/functionModule/businessComponent/solutions",
                            "resId": "solutions",
                            "isParent":true
                        }
                    ],
                    "name": "businessComponent",
                    "path": "/functionModule/businessComponent",
                    "resId": "businessComponent",
                    "isParent":true
                },
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "name": "componentSourceCode",
                                    "path": "/functionModule/technologyComponent/bank/componentSourceCode",
                                    "resId": "componentSourceCode",
                                    "isParent":true
                                },
                                {
                                    "name": "dependencies",
                                    "path": "/functionModule/technologyComponent/bank/dependencies",
                                    "resId": "dependencies",
                                    "isParent":true
                                },
                                {
                                    "name": "lib",
                                    "path": "/functionModule/technologyComponent/bank/lib",
                                    "resId": "lib",
                                    "isParent":true
                                },
                                {
                                    "name": "registerInfo",
                                    "path": "/functionModule/technologyComponent/bank/registerInfo",
                                    "resId": "registerInfo",
                                    "isParent":true
                                }
                            ],
                            "name": "bank",
                            "path": "/functionModule/technologyComponent/bank",
                            "resId": "bank",
                            "isParent":true
                        },
                        {
                            "name": "output",
                            "path": "/functionModule/technologyComponent/output",
                            "resId": "output",
                            "isParent":true
                        },
                        {
                            "children": [
                                {
                                    "name": "componentSourceCode",
                                    "path": "/functionModule/technologyComponent/platform/componentSourceCode",
                                    "resId": "componentSourceCode",
                                    "isParent":true
                                },
                                {
                                    "name": "dependencies",
                                    "path": "/functionModule/technologyComponent/platform/dependencies",
                                    "resId": "dependencies",
                                    "isParent":true
                                },
                                {
                                    "name": "lib",
                                    "path": "/functionModule/technologyComponent/platform/lib",
                                    "resId": "lib",
                                    "isParent":true
                                },
                                {
                                    "name": "registerInfo",
                                    "path": "/functionModule/technologyComponent/platform/registerInfo",
                                    "resId": "registerInfo",
                                    "isParent":true
                                }
                            ],
                            "name": "platform",
                            "path": "/functionModule/technologyComponent/platform",
                            "resId": "platform",
                            "isParent":true
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "componentSourceCode",
                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/componentSourceCode",
                                                    "resId": "componentSourceCode",
                                                    "isParent":true
                                                },
                                                {
                                                    "name": "dependencies",
                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/dependencies",
                                                    "resId": "dependencies",
                                                    "isParent":true
                                                },
                                                {
                                                    "name": "lib",
                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/lib",
                                                    "resId": "lib",
                                                    "isParent":true
                                                },
                                                {
                                                    "name": "registerInfo",
                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/registerInfo",
                                                    "resId": "registerInfo",
                                                    "isParent":true
                                                }
                                            ],
                                            "name": "heii",
                                            "path": "/functionModule/technologyComponent/projects/hello/heii",
                                            "resId": "application",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "hello",
                                    "path": "/functionModule/technologyComponent/projects/hello",
                                    "resId": "project",
                                    "isParent":true
                                }
                            ],
                            "name": "projects",
                            "path": "/functionModule/technologyComponent/projects",
                            "resId": "projects",
                            "isParent":true
                        },
                        {
                            "name": "solutions",
                            "path": "/functionModule/technologyComponent/solutions",
                            "resId": "solutions",
                            "isParent":true
                        }
                    ],
                    "name": "technologyComponent",
                    "path": "/functionModule/technologyComponent",
                    "resId": "technologyComponent",
                    "isParent":true
                }
            ],
            "name": "functionModule",
            "path": "/functionModule",
            "resId": "functionModule",
            "isParent":true
        },
        {
            "children": [
                {
                    "name": "extService",
                    "path": "/hello/extService",
                    "resId": "extService",
                    "isParent":true
                },
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "sql.sql",
                                                    "path": "/hello/heii/aaaa/config/dataConfig/sql.sql",
                                                    "resId": "sql"
                                                }
                                            ],
                                            "name": "dataConfig",
                                            "path": "/hello/heii/aaaa/config/dataConfig",
                                            "resId": "dataConfig",
                                            "isParent":true
                                        },
                                        {
                                            "name": "documentConfig",
                                            "path": "/hello/heii/aaaa/config/documentConfig",
                                            "resId": "documentConfig",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "config",
                                    "path": "/hello/heii/aaaa/config",
                                    "resId": "config",
                                    "isParent":true
                                },
                                {
                                    "children": [
                                        {
                                            "name": "checkout",
                                            "path": "/hello/heii/aaaa/document/checkout",
                                            "resId": "checkout",
                                            "isParent":true
                                        },
                                        {
                                            "name": "design",
                                            "path": "/hello/heii/aaaa/document/design",
                                            "resId": "design",
                                            "isParent":true
                                        },
                                        {
                                            "name": "operation",
                                            "path": "/hello/heii/aaaa/document/operation",
                                            "resId": "operation",
                                            "isParent":true
                                        },
                                        {
                                            "name": "requirement",
                                            "path": "/hello/heii/aaaa/document/requirement",
                                            "resId": "requirement",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "document",
                                    "path": "/hello/heii/aaaa/document",
                                    "resId": "document",
                                    "isParent":true
                                },
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "Taaaa.java",
                                                    "path": "/hello/heii/aaaa/flow/compileResult/Taaaa.java",
                                                    "resId": "java",
                                                },
                                                {
                                                    "name": "heii.aaaa.jar",
                                                    "path": "/hello/heii/aaaa/flow/compileResult/heii.aaaa.jar",
                                                    "resId": "jar",
                                                },
                                                {
                                                    "name": "heii_aaaa.src",
                                                    "path": "/hello/heii/aaaa/flow/compileResult/heii_aaaa.src",
                                                    "resId": "src",
                                                }
                                            ],
                                            "name": "compileResult",
                                            "path": "/hello/heii/aaaa/flow/compileResult",
                                            "resId": "compileResult",
                                            "isParent":true
                                        },
                                        {
                                            "name": "dfc.dfc",
                                            "path": "/hello/heii/aaaa/flow/dfc.dfc",
                                            "resId": "dfc",
                                        },
                                        {
                                            "name": "flowConfig.fc",
                                            "path": "/hello/heii/aaaa/flow/flowConfig.fc",
                                            "resId": "fc",
                                        },
                                        {
                                            "name": "par.par",
                                            "path": "/hello/heii/aaaa/flow/par.par",
                                            "resId": "par",
                                        }
                                    ],
                                    "name": "flow",
                                    "path": "/hello/heii/aaaa/flow",
                                    "resId": "flow",
                                    "isParent":true
                                },
                                {
                                    "children": [
                                        {
                                            "name": "executableProgram",
                                            "path": "/hello/heii/aaaa/run/executableProgram",
                                            "resId": "executableProgram",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "run",
                                    "path": "/hello/heii/aaaa/run",
                                    "resId": "run",
                                    "isParent":true
                                },
                                {
                                    "children": [
                                        {
                                            "name": "functionTest",
                                            "path": "/hello/heii/aaaa/test/functionTest",
                                            "resId": "functionTest",
                                            "isParent":true
                                        },
                                        {
                                            "name": "performanceTest",
                                            "path": "/hello/heii/aaaa/test/performanceTest",
                                            "resId": "performanceTest",
                                            "isParent":true
                                        }
                                    ],
                                    "name": "test",
                                    "path": "/hello/heii/aaaa/test",
                                    "resId": "test",
                                    "isParent":true
                                }
                            ],
                            "name": "aaaa",
                            "path": "/hello/heii/aaaa",
                            "resId": "service",
                            "isParent":true
                        },
                        {
                            "name": "servicePublish",
                            "path": "/hello/heii/servicePublish",
                            "resId": "servicePublish",
                            "isParent":true
                        }
                    ],
                    "name": "heii",
                    "path": "/hello/heii",
                    "resId": "application",
                    "isParent":true
                },
                {
                    "name": "servicePublish",
                    "path": "/hello/servicePublish",
                    "resId": "servicePublish",
                    "isParent":true
                }
            ],
            "name": "hello",
            "path": "/hello",
            "resId": "project",
            "isParent":true
        },
        {
            "children": [
                {
                    "name": "projects",
                    "path": "/publicPrototype/projects",
                    "resId": "projects",
                    "isParent":true
                },
                {
                    "name": "solutions",
                    "path": "/publicPrototype/solutions",
                    "resId": "solutions",
                    "isParent":true
                }
            ],
            "name": "publicPrototype",
            "path": "/publicPrototype",
            "resId": "publicPrototype",
            "isParent":true
        },
        {
            "children": [
                {
                    "name": "extService",
                    "path": "/publicService/extService",
                    "resId": "extService",
                    "isParent":true
                },
                {
                    "name": "servicePublish",
                    "path": "/publicService/servicePublish",
                    "resId": "servicePublish",
                    "isParent":true
                }
            ],
            "name": "publicService",
            "path": "/publicService",
            "resId": "publicService",
            "isParent":true
        },{
            "name": "file1.txt",
            "path": "/file1.txt",
            "resId": "txt"
        },{
            "name": "file11.txt",
            "path": "/file11.txt",
            "resId": "txt"
        },{
            "name": "file10.txt",
            "path": "/file10.txt",
            "resId": "txt"
        },{
            "name": "file91wfdsf我们沙发舒服的撒eeee.txt",
            "path": "/file91wfdsf我们沙发舒服的撒eeee.txt",
            "resId": "txt"
        },{
            "name": "fi.txt",
            "path": "/fi.txt",
            "resId": "txt"
        },{
            "name": "file7.txt",
            "path": "/file7.txt",
            "resId": "txt"
        },{
            "name": "file6.txt",
            "path": "/file6.txt",
            "resId": "txt"
        },{
            "name": "file5.txt",
            "path": "/file5.txt",
            "resId": "txt"
        },{
            "name": "file4.txt",
            "path": "/file4.txt",
            "resId": "txt"
        },{
            "name": "file3.txt",
            "path": "/file3.txt",
            "resId": "txt"
        },{
            "name": "file2.txt",
            "path": "/file2.txt",
            "resId": "txt"
        }
    ];
    export default{
        data(){
            var self = this;
            return {
                editors: {},
                vertical: false,
                horizontal: true,
                pageName: "pageName",
                naviContextMenuItems: [],
                contextMenuConfig: {
                    callback: {
                        onClick: function (id) {
                            console.info("contextmenu onclick : " + id);
                        }
                    }
                },
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
                toolbarConfig:{
                    callback: {
                        onClick: function (item) {
                            console.info("toolbar item onclick : " + item.id);
                        }
                    },
                    direction: 'left'
                },
                menuData: [
                    {
                        id: 'main',
                        name: 'AFAIDE',
                        type: 'group',
                        children: [
                            {
                                id: 'main/about',
                                name: 'About',
                                type: 'group',
                                img: "assets/image/nav-folder.png",
                                children: [
                                    {
                                        id: 'main/about/test1',
                                        name: 'test1',
                                        type: 'group',
                                        children: [
                                            {
                                                id: 'main/about/test1/test1_t1',
                                                img: "assets/image/nav-folder.png",
                                                name: 'test1_t1',
                                                type: 'action'
                                            }
                                        ]
                                    },
                                    {
                                        id: 'main/about/test2',
                                        name: 'test2',
                                        type: 'group'
                                    }
                                ]
                            },
                            {
                                id: 'main/preference',
                                name: 'Preference',
                                type: 'action',
                                shortcut: 'Ctrl+A'
                            }
                        ]
                    },
                    {
                        id: 'file',
                        name: 'File',
                        type: 'group',
                        children: []
                    },
                    {
                        id: 'edit',
                        name: 'Edit',
                        type: 'group',
                        children: []
                    },
                    {
                        id: 'view',
                        name: 'View',
                        type: 'group',
                        children: []
                    }
                ],
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
                    },{
                        id: 'test1',
                        subgroup: 0,
                        open: true,
                    },{
                        id: 'test2',
                        subgroup: 0,
                        open: true,
                    }]
                },
            }
        },
        methods: {},
        mounted(){
            window.IDE = {
                type:'afa'
            }

            window.Menu = this.$refs.ide_menu;
            window.NAVI = this.$refs.ide_navigator;
            window.CONTEXTMENU = this.$refs.ide_contextMenu;
            window.SHADE = this.$refs.ide_shade;

            let socket = io("http://127.0.0.1:8760");
            socket.on('connect_failed',function (err) {
                console.info(err);
            });

            socket.on('connect',function () {
                console.info("connect successful");
                socket.emit('getNaviItems',{
                    type:IDE.type,
                    event:'getNaviItems',
                    data:{
                        path:'\\',
                        level:2
                    }
                },function (data) {
                    console.info('getNaviItems',data);
                });
            });


        },
        beforeCreate(){
            var self = this;
            window.viewRegistry = {
                'navigator': {
                    name: '导航器',
                    component: './tree.vue',
                    data: {
                        config: {
                            check:false,
                            async: {
                                enable: true,
                                url:"/TestZTree/test",
                                autoParam:["path","resId"]
                            },
                            callback: {
                                delete: function (item) {
                                    var editor = WORKBENCHPAGE.getEditor(item);
                                    if (editor) {
                                        WORKBENCHPAGE.closeEditor(item);
                                    }
                                },
                                click: function (item) {
                                },
                                dblclick: function (item) {
                                    if (!item.model.isParent) {
                                        WORKBENCHPAGE.openEditor(item);
                                    }
                                },
                                rightClick: function (event, item) {
                                    CONTEXTMENU.setItems([{
                                        id: "01",
                                        name: "01都是负担0000我们的长长长长长长",
                                        img: "assets/image/nav-folder.png",
                                        shortcutKey: "01",
                                        type: 'group'
                                    }, {
                                        id: "02",
                                        name: "02",
                                        img: "",
                                        shortcutKey: "ctrl+r",
                                        type: 'item',
                                        disable: true
                                    }, {
                                        type: "separator"
                                    }, {
                                        id: "03",
                                        name: "03",
                                        img: "",
                                        shortcutKey: "ctrl+l",
                                        type: 'item',
                                    },
                                        {
                                            id: "03",
                                            name: "01都是负担0000我们的长长长长长长",
                                            img: "assets/image/nav-folder.png",
                                            shortcutKey: "01",
                                            type: 'group'
                                        }, {
                                            id: "04",
                                            name: "04",
                                            img: "",
                                            shortcutKey: "ctrl+l",
                                            type: 'item',
                                        }, {
                                            id: "05",
                                            name: "05",
                                            img: "",
                                            shortcutKey: "ctrl+l",
                                            type: 'item',
                                        }]);
                                    CONTEXTMENU.setCallback(self.contextMenuConfig.callback);
                                    if (CONTEXTMENU.isActive()) {
                                        CONTEXTMENU.hide();
                                    }
                                    CONTEXTMENU.show(event.x, event.y);
                                }
                            }
                        },
                        model: naviItems,
                    },
                    image: "assets/image/nav-folder.png",
                },
                'properties': {
                    name: '属性',
                    component: './editorPart.vue',
                    image: "assets/image/nav-folder.png",
                    data:{
                        toolItems:[
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
                    component: './editorPart.vue',
                    image: "assets/image/nav-folder.png",
                },
                'error': {
                    name: '错误控制',
                    component: './editorPart.vue',
                    image: "assets/image/nav-folder.png",
                },
                'problem': {
                    name: '问题',
                    component: './editorPart.vue',
                    image: "assets/image/nav-folder.png",
                },
                'version': {
                    name: '版本',
                    component: './editorPart.vue',
                    image: "assets/image/nav-folder.png",
                },
                'test1': {
                    name: '测试1',
                    component: './editorPart.vue',
                    image: "assets/image/nav-folder.png",
                },
                'test2': {
                    name: '测试2',
                    component: './editorPart.vue',
                    image: "assets/image/nav-folder.png",
                },
                'test3': {
                    name: '测试3',
                    component: './editorPart.vue',
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