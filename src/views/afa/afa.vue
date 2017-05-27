<template>
<div>
    <nav class="navbar navbar-default navbar-fixed-top">
        <menubar id="ide_menu" ref="ide_menu"></menubar>
    </nav>
    <div id="ide_workbench" class="container-fluid">
        <navigator id="ide_navigator" ref="ide_navigator" :model="naviModel" :config="naviConfig"
                   class="col-sm-2 col-md-3 col-xs-3" draggable="true"></navigator>
        <workbenchPage id="ide_workbenchPage" ref="ide_workbenchPage" class="col-sm-10 col-md-9 col-xs-9">
        </workbenchPage>
    </div>

</div>
</template>
<style>
    @import "~bootstrap/dist/css/bootstrap.css";
    #ide_workbench{
        padding: 0px;
    }
    #ide_navigator{
        border: 1px solid gray;
        height: 100%;
    }

    #ide_workbenchPage{
        border: 1px solid gray;
        height: 100%;
    }
</style>
<script>
    import "jquery";
    import "bootstrap";
    import "ztree";
    import menu from "../components/menu.vue";
    import navi from "../components/tree.vue";
    import workbenchPage from "../components/workbenchPage.vue";

    export default{
        data(){
            return {
                pageName:"pageName",
                naviConfig :{
                    check:true,
                    async: {
                        enable: true,
                        url:"/TestZTree/test",
                        autoParam:["path","resId"]
                    },
                    callback: {
                        beforeDelete:function (item) {
                            var editor = WORKBENCHPAGE.getEditor(item);
                            if(editor && editor.isDirty()){
                                alert("编辑器脏，无法delete资源");
                                return false;
                            }
                            return true;
                        },
                        delete: function (item) {
                            var editor = WORKBENCHPAGE.getEditor(item);
                            if(editor){
                                WORKBENCHPAGE.closeEditor(item);
                            }
                        },
                        click:function (item) {
                        },
                        dblclick:function (item) {
                            console.info(NAVI.getCheckedItems());
                            if(item.model.isFile) {
                                WORKBENCHPAGE.openEditor(item);
                            }
                        },
                        rightClick:function (event,item) {
                        }
                    }
                },
                naviModel: {
                    "children": [
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
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "messageInterface",
                                                    "path": "/dataModule/dataInterface/bank/messageInterface",
                                                    "resId": "messageInterface",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "bank",
                                            "path": "/dataModule/dataInterface/bank",
                                            "resId": "bank",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "output",
                                            "path": "/dataModule/dataInterface/output",
                                            "resId": "output",
                                            "isFolder":true
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
                                                                    "isFolder":true
                                                                },
                                                                {
                                                                    "name": "messageInterface",
                                                                    "path": "/dataModule/dataInterface/projects/hello/heii/messageInterface",
                                                                    "resId": "messageInterface",
                                                                    "isFolder":true
                                                                }
                                                            ],
                                                            "name": "heii",
                                                            "path": "/dataModule/dataInterface/projects/hello/heii",
                                                            "resId": "application",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/dataModule/dataInterface/projects/hello",
                                                    "resId": "project",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/dataModule/dataInterface/projects",
                                            "resId": "projects",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "solutions",
                                            "path": "/dataModule/dataInterface/solutions",
                                            "resId": "solutions",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "dataInterface",
                                    "path": "/dataModule/dataInterface",
                                    "resId": "dataInterface",
                                    "isFolder":true
                                },
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "dataEntities",
                                                    "path": "/dataModule/dataObject/bank/dataEntities",
                                                    "resId": "dataEntities",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "srcFolder",
                                                    "path": "/dataModule/dataObject/bank/srcFolder",
                                                    "resId": "srcFolder",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "bank",
                                            "path": "/dataModule/dataObject/bank",
                                            "resId": "bank",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "output",
                                            "path": "/dataModule/dataObject/output",
                                            "resId": "output",
                                            "isFolder":true
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
                                                                    "isFolder":true
                                                                },
                                                                {
                                                                    "name": "srcFolder",
                                                                    "path": "/dataModule/dataObject/projects/hello/heii/srcFolder",
                                                                    "resId": "srcFolder",
                                                                    "isFolder":true
                                                                }
                                                            ],
                                                            "name": "heii",
                                                            "path": "/dataModule/dataObject/projects/hello/heii",
                                                            "resId": "application",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/dataModule/dataObject/projects/hello",
                                                    "resId": "project",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/dataModule/dataObject/projects",
                                            "resId": "projects",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "solutions",
                                            "path": "/dataModule/dataObject/solutions",
                                            "resId": "solutions",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "dataObject",
                                    "path": "/dataModule/dataObject",
                                    "resId": "dataObject",
                                    "isFolder":true
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
                                                                    "isFolder":true
                                                                }
                                                            ],
                                                            "name": "heii",
                                                            "path": "/dataModule/databaseTable/projects/hello/heii",
                                                            "resId": "application",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/dataModule/databaseTable/projects/hello",
                                                    "resId": "project",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/dataModule/databaseTable/projects",
                                            "resId": "projects",
                                            "isFolder":true
                                        },
                                        {
                                            "children": [],
                                            "name": "solutions",
                                            "path": "/dataModule/databaseTable/solutions",
                                            "resId": "solutions",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "databaseTable",
                                    "path": "/dataModule/databaseTable",
                                    "resId": "databaseTable",
                                    "isFolder":true
                                },
                                {
                                    "children": [
                                        {
                                            "name": "bank",
                                            "path": "/dataModule/datadict/bank",
                                            "resId": "bank",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "platform",
                                            "path": "/dataModule/datadict/platform",
                                            "resId": "platform",
                                            "isFolder":true
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [
                                                        {
                                                            "name": "heii",
                                                            "path": "/dataModule/datadict/projects/hello/heii",
                                                            "resId": "application",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/dataModule/datadict/projects/hello",
                                                    "resId": "project",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/dataModule/datadict/projects",
                                            "resId": "projects",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "solutions",
                                            "path": "/dataModule/datadict/solutions",
                                            "resId": "solutions",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "datadict",
                                    "path": "/dataModule/datadict",
                                    "resId": "datadict",
                                    "isFolder":true
                                }
                            ],
                            "name": "dataModule",
                            "path": "/dataModule",
                            "resId": "dataModule",
                            "isFolder":true
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "name": "commonBusinessTemplate",
                                            "path": "/flowModule/bank/commonBusinessTemplate",
                                            "resId": "businessTemplate",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "commonTechnologyTemplate",
                                            "path": "/flowModule/bank/commonTechnologyTemplate",
                                            "resId": "technologyTemplate",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "commonTradeTemplate",
                                            "path": "/flowModule/bank/commonTradeTemplate",
                                            "resId": "tradeTemplate",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "bank",
                                    "path": "/flowModule/bank",
                                    "resId": "bank",
                                    "isFolder":true
                                },
                                {
                                    "children": [
                                        {
                                            "name": "commonBusinessTemplate",
                                            "path": "/flowModule/platform/commonBusinessTemplate",
                                            "resId": "businessTemplate",
                                            "isFolder":true
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [
                                                        {
                                                            "children": null,
                                                            "name": "sf.sf",
                                                            "path": "/flowModule/platform/commonTechnologyTemplate/flowInit/sf.sf",
                                                            "resId": "sf",
                                                            "isFile":true

                                                        }
                                                    ],
                                                    "name": "flowInit",
                                                    "path": "/flowModule/platform/commonTechnologyTemplate/flowInit",
                                                    "resId": "flowInit",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "commonTechnologyTemplate",
                                            "path": "/flowModule/platform/commonTechnologyTemplate",
                                            "resId": "technologyTemplate",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "commonTradeTemplate",
                                            "path": "/flowModule/platform/commonTradeTemplate",
                                            "resId": "tradeTemplate",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "platform",
                                    "path": "/flowModule/platform",
                                    "resId": "platform",
                                    "isFolder":true
                                },
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "commonBusinessTemplate",
                                                    "path": "/flowModule/projects/hello/commonBusinessTemplate",
                                                    "resId": "businessTemplate",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "commonTechnologyTemplate",
                                                    "path": "/flowModule/projects/hello/commonTechnologyTemplate",
                                                    "resId": "technologyTemplate",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "commonTradeTemplate",
                                                    "path": "/flowModule/projects/hello/commonTradeTemplate",
                                                    "resId": "tradeTemplate",
                                                    "isFolder":true
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "name": "privateBusinessTemplate",
                                                            "path": "/flowModule/projects/hello/heii/privateBusinessTemplate",
                                                            "resId": "businessTemplate",
                                                            "isFolder":true
                                                        },
                                                        {
                                                            "name": "privateTechnologyTemplate",
                                                            "path": "/flowModule/projects/hello/heii/privateTechnologyTemplate",
                                                            "resId": "technologyTemplate",
                                                            "isFolder":true
                                                        },
                                                        {
                                                            "name": "privateTradeTemplate",
                                                            "path": "/flowModule/projects/hello/heii/privateTradeTemplate",
                                                            "resId": "tradeTemplate",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "heii",
                                                    "path": "/flowModule/projects/hello/heii",
                                                    "resId": "application",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "hello",
                                            "path": "/flowModule/projects/hello",
                                            "resId": "project",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "projects",
                                    "path": "/flowModule/projects",
                                    "resId": "projects",
                                    "isFolder":true
                                },
                                {
                                    "name": "solutions",
                                    "path": "/flowModule/solutions",
                                    "resId": "solutions",
                                    "isFolder":true
                                }
                            ],
                            "name": "flowModule",
                            "path": "/flowModule",
                            "resId": "flowModule",
                            "isFolder":true
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "name": "bank",
                                            "path": "/functionModule/businessComponent/bank",
                                            "resId": "bank",
                                            "isFolder":true
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [
                                                        {
                                                            "name": "heii",
                                                            "path": "/functionModule/businessComponent/projects/hello/heii",
                                                            "resId": "application",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/functionModule/businessComponent/projects/hello",
                                                    "resId": "project",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/functionModule/businessComponent/projects",
                                            "resId": "projects",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "solutions",
                                            "path": "/functionModule/businessComponent/solutions",
                                            "resId": "solutions",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "businessComponent",
                                    "path": "/functionModule/businessComponent",
                                    "resId": "businessComponent",
                                    "isFolder":true
                                },
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "name": "componentSourceCode",
                                                    "path": "/functionModule/technologyComponent/bank/componentSourceCode",
                                                    "resId": "componentSourceCode",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "dependencies",
                                                    "path": "/functionModule/technologyComponent/bank/dependencies",
                                                    "resId": "dependencies",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "lib",
                                                    "path": "/functionModule/technologyComponent/bank/lib",
                                                    "resId": "lib",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "registerInfo",
                                                    "path": "/functionModule/technologyComponent/bank/registerInfo",
                                                    "resId": "registerInfo",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "bank",
                                            "path": "/functionModule/technologyComponent/bank",
                                            "resId": "bank",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "output",
                                            "path": "/functionModule/technologyComponent/output",
                                            "resId": "output",
                                            "isFolder":true
                                        },
                                        {
                                            "children": [
                                                {
                                                    "name": "componentSourceCode",
                                                    "path": "/functionModule/technologyComponent/platform/componentSourceCode",
                                                    "resId": "componentSourceCode",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "dependencies",
                                                    "path": "/functionModule/technologyComponent/platform/dependencies",
                                                    "resId": "dependencies",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "lib",
                                                    "path": "/functionModule/technologyComponent/platform/lib",
                                                    "resId": "lib",
                                                    "isFolder":true
                                                },
                                                {
                                                    "name": "registerInfo",
                                                    "path": "/functionModule/technologyComponent/platform/registerInfo",
                                                    "resId": "registerInfo",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "platform",
                                            "path": "/functionModule/technologyComponent/platform",
                                            "resId": "platform",
                                            "isFolder":true
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
                                                                    "isFolder":true
                                                                },
                                                                {
                                                                    "name": "dependencies",
                                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/dependencies",
                                                                    "resId": "dependencies",
                                                                    "isFolder":true
                                                                },
                                                                {
                                                                    "name": "lib",
                                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/lib",
                                                                    "resId": "lib",
                                                                    "isFolder":true
                                                                },
                                                                {
                                                                    "name": "registerInfo",
                                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/registerInfo",
                                                                    "resId": "registerInfo",
                                                                    "isFolder":true
                                                                }
                                                            ],
                                                            "name": "heii",
                                                            "path": "/functionModule/technologyComponent/projects/hello/heii",
                                                            "resId": "application",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/functionModule/technologyComponent/projects/hello",
                                                    "resId": "project",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/functionModule/technologyComponent/projects",
                                            "resId": "projects",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "solutions",
                                            "path": "/functionModule/technologyComponent/solutions",
                                            "resId": "solutions",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "technologyComponent",
                                    "path": "/functionModule/technologyComponent",
                                    "resId": "technologyComponent",
                                    "isFolder":true
                                }
                            ],
                            "name": "functionModule",
                            "path": "/functionModule",
                            "resId": "functionModule",
                            "isFolder":true
                        },
                        {
                            "children": [
                                {
                                    "name": "extService",
                                    "path": "/hello/extService",
                                    "resId": "extService",
                                    "isFolder":true
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
                                                                    "resId": "sql",
                                                                    "isFile":true

                                                                }
                                                            ],
                                                            "name": "dataConfig",
                                                            "path": "/hello/heii/aaaa/config/dataConfig",
                                                            "resId": "dataConfig",
                                                            "isFolder":true
                                                        },
                                                        {
                                                            "name": "documentConfig",
                                                            "path": "/hello/heii/aaaa/config/documentConfig",
                                                            "resId": "documentConfig",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "config",
                                                    "path": "/hello/heii/aaaa/config",
                                                    "resId": "config",
                                                    "isFolder":true
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "name": "checkout",
                                                            "path": "/hello/heii/aaaa/document/checkout",
                                                            "resId": "checkout",
                                                            "isFolder":true
                                                        },
                                                        {
                                                            "name": "design",
                                                            "path": "/hello/heii/aaaa/document/design",
                                                            "resId": "design",
                                                            "isFolder":true
                                                        },
                                                        {
                                                            "name": "operation",
                                                            "path": "/hello/heii/aaaa/document/operation",
                                                            "resId": "operation",
                                                            "isFolder":true
                                                        },
                                                        {
                                                            "name": "requirement",
                                                            "path": "/hello/heii/aaaa/document/requirement",
                                                            "resId": "requirement",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "document",
                                                    "path": "/hello/heii/aaaa/document",
                                                    "resId": "document",
                                                    "isFolder":true
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
                                                            "isFolder":true
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
                                                    "isFolder":true
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "name": "executableProgram",
                                                            "path": "/hello/heii/aaaa/run/executableProgram",
                                                            "resId": "executableProgram",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "run",
                                                    "path": "/hello/heii/aaaa/run",
                                                    "resId": "run",
                                                    "isFolder":true
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "name": "functionTest",
                                                            "path": "/hello/heii/aaaa/test/functionTest",
                                                            "resId": "functionTest",
                                                            "isFolder":true
                                                        },
                                                        {
                                                            "name": "performanceTest",
                                                            "path": "/hello/heii/aaaa/test/performanceTest",
                                                            "resId": "performanceTest",
                                                            "isFolder":true
                                                        }
                                                    ],
                                                    "name": "test",
                                                    "path": "/hello/heii/aaaa/test",
                                                    "resId": "test",
                                                    "isFolder":true
                                                }
                                            ],
                                            "name": "aaaa",
                                            "path": "/hello/heii/aaaa",
                                            "resId": "service",
                                            "isFolder":true
                                        },
                                        {
                                            "name": "servicePublish",
                                            "path": "/hello/heii/servicePublish",
                                            "resId": "servicePublish",
                                            "isFolder":true
                                        }
                                    ],
                                    "name": "heii",
                                    "path": "/hello/heii",
                                    "resId": "application",
                                    "isFolder":true
                                },
                                {
                                    "name": "servicePublish",
                                    "path": "/hello/servicePublish",
                                    "resId": "servicePublish",
                                    "isFolder":true
                                }
                            ],
                            "name": "hello",
                            "path": "/hello",
                            "resId": "project",
                            "isFolder":true
                        },
                        {
                            "children": [
                                {
                                    "name": "projects",
                                    "path": "/publicPrototype/projects",
                                    "resId": "projects",
                                    "isFolder":true
                                },
                                {
                                    "name": "solutions",
                                    "path": "/publicPrototype/solutions",
                                    "resId": "solutions",
                                    "isFolder":true
                                }
                            ],
                            "name": "publicPrototype",
                            "path": "/publicPrototype",
                            "resId": "publicPrototype",
                            "isFolder":true
                        },
                        {
                            "children": [
                                {
                                    "name": "extService",
                                    "path": "/publicService/extService",
                                    "resId": "extService",
                                    "isFolder":true
                                },
                                {
                                    "name": "servicePublish",
                                    "path": "/publicService/servicePublish",
                                    "resId": "servicePublish",
                                    "isFolder":true
                                }
                            ],
                            "name": "publicService",
                            "path": "/publicService",
                            "resId": "publicService",
                            "isFolder":true
                        },{
                            "name": "file1.txt",
                            "path": "/file1",
                            "resId": "txt",
                            "isFile":true
                        }
                    ],
                    "name": "AFAIDE",
                    "path": "/",
                    "resId": "AFAIDE",
                    "type": "IWorkspaceRoot"
                }
            }
        },
        methods: {
        },
        mounted(){
              window.Menu = this.$refs.ide_menu;
              window.NAVI = this.$refs.ide_navigator;
              window.WORKBENCHPAGE = this.$refs.ide_workbenchPage;

//            this.naviModel;
//            IDE.get('naviInit',function(data){
//                this.naviModel=data;
//            });
//
//
//            IDE.get('proposal',{},callback);
//
//            IDE.on('',function(){
//
//            });
        },
        components: {
            navigator: navi,
            menubar: menu,
            workbenchPage:workbenchPage
        }
    }
</script>