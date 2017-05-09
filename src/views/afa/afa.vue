<template>
    <div>
        <div class="top">{{pageName.length}}
            <input type="text" v-model="pageName"/>
        </div>
        <div class="mid">
            <div class="navi">
                <navigator :model="naviModel"></navigator>
            </div>
            <!--<editor></editor>-->
        </div>
        <div class="bottom">这里是bottom</div>
    </div>
</template>
<style>
    .top {
        position: relative;
        padding:0px 40px ;
        width:100%;
        height:80px;
        background-color: #57A;
    }

    .mid {
        position: absolute;
        padding: 2px 10px;
        bottom:40px;
        top:84px;
        width:100%;
        background-color: #AAA;
    }

    .navi {
        position: relative;
        width: 180px;
        margin: 0 0 0 0;
        padding: 10px;
        height:100%;
        border: 1px solid #999;
        background-color: #FFF;
    }
    .bottom{
        position:absolute;
        width:100%;
        height:40px;
        bottom:0px;
        background-color: #0C7;
    }
</style>
<script>
    import navi from "../components/znavi.vue";

    export default{
        data(){
            return {
                pageName:"pageName",
                naviModel: {
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "children": [],
                                                    "name": "documentInterface",
                                                    "path": "/dataModule/dataInterface/bank/documentInterface",
                                                    "resId": "documentInterface",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "messageInterface",
                                                    "path": "/dataModule/dataInterface/bank/messageInterface",
                                                    "resId": "messageInterface",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "bank",
                                            "path": "/dataModule/dataInterface/bank",
                                            "resId": "bank",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "output",
                                            "path": "/dataModule/dataInterface/output",
                                            "resId": "output",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [
                                                        {
                                                            "children": [
                                                                {
                                                                    "children": [],
                                                                    "name": "documentInterface",
                                                                    "path": "/dataModule/dataInterface/projects/hello/heii/documentInterface",
                                                                    "resId": "documentInterface",
                                                                    "type": "IFolder"
                                                                },
                                                                {
                                                                    "children": [],
                                                                    "name": "messageInterface",
                                                                    "path": "/dataModule/dataInterface/projects/hello/heii/messageInterface",
                                                                    "resId": "messageInterface",
                                                                    "type": "IFolder"
                                                                }
                                                            ],
                                                            "name": "heii",
                                                            "path": "/dataModule/dataInterface/projects/hello/heii",
                                                            "resId": "application",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/dataModule/dataInterface/projects/hello",
                                                    "resId": "project",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/dataModule/dataInterface/projects",
                                            "resId": "projects",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "solutions",
                                            "path": "/dataModule/dataInterface/solutions",
                                            "resId": "solutions",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "dataInterface",
                                    "path": "/dataModule/dataInterface",
                                    "resId": "dataInterface",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "children": [],
                                                    "name": "dataEntities",
                                                    "path": "/dataModule/dataObject/bank/dataEntities",
                                                    "resId": "dataEntities",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "srcFolder",
                                                    "path": "/dataModule/dataObject/bank/srcFolder",
                                                    "resId": "srcFolder",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "bank",
                                            "path": "/dataModule/dataObject/bank",
                                            "resId": "bank",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "output",
                                            "path": "/dataModule/dataObject/output",
                                            "resId": "output",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [
                                                        {
                                                            "children": [
                                                                {
                                                                    "children": [],
                                                                    "name": "dataEntities",
                                                                    "path": "/dataModule/dataObject/projects/hello/heii/dataEntities",
                                                                    "resId": "dataEntities",
                                                                    "type": "IFolder"
                                                                },
                                                                {
                                                                    "children": [],
                                                                    "name": "srcFolder",
                                                                    "path": "/dataModule/dataObject/projects/hello/heii/srcFolder",
                                                                    "resId": "srcFolder",
                                                                    "type": "IFolder"
                                                                }
                                                            ],
                                                            "name": "heii",
                                                            "path": "/dataModule/dataObject/projects/hello/heii",
                                                            "resId": "application",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/dataModule/dataObject/projects/hello",
                                                    "resId": "project",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/dataModule/dataObject/projects",
                                            "resId": "projects",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "solutions",
                                            "path": "/dataModule/dataObject/solutions",
                                            "resId": "solutions",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "dataObject",
                                    "path": "/dataModule/dataObject",
                                    "resId": "dataObject",
                                    "type": "IFolder"
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
                                                                    "children": [],
                                                                    "name": "databaseModule",
                                                                    "path": "/dataModule/databaseTable/projects/hello/heii/databaseModule",
                                                                    "resId": "databaseModule",
                                                                    "type": "IFolder"
                                                                }
                                                            ],
                                                            "name": "heii",
                                                            "path": "/dataModule/databaseTable/projects/hello/heii",
                                                            "resId": "application",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/dataModule/databaseTable/projects/hello",
                                                    "resId": "project",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/dataModule/databaseTable/projects",
                                            "resId": "projects",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "solutions",
                                            "path": "/dataModule/databaseTable/solutions",
                                            "resId": "solutions",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "databaseTable",
                                    "path": "/dataModule/databaseTable",
                                    "resId": "databaseTable",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [
                                        {
                                            "children": [],
                                            "name": "bank",
                                            "path": "/dataModule/datadict/bank",
                                            "resId": "bank",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "platform",
                                            "path": "/dataModule/datadict/platform",
                                            "resId": "platform",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [
                                                        {
                                                            "children": [],
                                                            "name": "heii",
                                                            "path": "/dataModule/datadict/projects/hello/heii",
                                                            "resId": "application",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/dataModule/datadict/projects/hello",
                                                    "resId": "project",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/dataModule/datadict/projects",
                                            "resId": "projects",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "solutions",
                                            "path": "/dataModule/datadict/solutions",
                                            "resId": "solutions",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "datadict",
                                    "path": "/dataModule/datadict",
                                    "resId": "datadict",
                                    "type": "IFolder"
                                }
                            ],
                            "name": "dataModule",
                            "path": "/dataModule",
                            "resId": "dataModule",
                            "type": "IProject"
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [],
                                            "name": "commonBusinessTemplate",
                                            "path": "/flowModule/bank/commonBusinessTemplate",
                                            "resId": "businessTemplate",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "commonTechnologyTemplate",
                                            "path": "/flowModule/bank/commonTechnologyTemplate",
                                            "resId": "technologyTemplate",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "commonTradeTemplate",
                                            "path": "/flowModule/bank/commonTradeTemplate",
                                            "resId": "tradeTemplate",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "bank",
                                    "path": "/flowModule/bank",
                                    "resId": "bank",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [
                                        {
                                            "children": [],
                                            "name": "commonBusinessTemplate",
                                            "path": "/flowModule/platform/commonBusinessTemplate",
                                            "resId": "businessTemplate",
                                            "type": "IFolder"
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
                                                            "type": "IFile"
                                                        }
                                                    ],
                                                    "name": "flowInit",
                                                    "path": "/flowModule/platform/commonTechnologyTemplate/flowInit",
                                                    "resId": "flowInit",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "commonTechnologyTemplate",
                                            "path": "/flowModule/platform/commonTechnologyTemplate",
                                            "resId": "technologyTemplate",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "commonTradeTemplate",
                                            "path": "/flowModule/platform/commonTradeTemplate",
                                            "resId": "tradeTemplate",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "platform",
                                    "path": "/flowModule/platform",
                                    "resId": "platform",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "children": [],
                                                    "name": "commonBusinessTemplate",
                                                    "path": "/flowModule/projects/hello/commonBusinessTemplate",
                                                    "resId": "businessTemplate",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "commonTechnologyTemplate",
                                                    "path": "/flowModule/projects/hello/commonTechnologyTemplate",
                                                    "resId": "technologyTemplate",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "commonTradeTemplate",
                                                    "path": "/flowModule/projects/hello/commonTradeTemplate",
                                                    "resId": "tradeTemplate",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "children": [],
                                                            "name": "privateBusinessTemplate",
                                                            "path": "/flowModule/projects/hello/heii/privateBusinessTemplate",
                                                            "resId": "businessTemplate",
                                                            "type": "IFolder"
                                                        },
                                                        {
                                                            "children": [],
                                                            "name": "privateTechnologyTemplate",
                                                            "path": "/flowModule/projects/hello/heii/privateTechnologyTemplate",
                                                            "resId": "technologyTemplate",
                                                            "type": "IFolder"
                                                        },
                                                        {
                                                            "children": [],
                                                            "name": "privateTradeTemplate",
                                                            "path": "/flowModule/projects/hello/heii/privateTradeTemplate",
                                                            "resId": "tradeTemplate",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "heii",
                                                    "path": "/flowModule/projects/hello/heii",
                                                    "resId": "application",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "hello",
                                            "path": "/flowModule/projects/hello",
                                            "resId": "project",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "projects",
                                    "path": "/flowModule/projects",
                                    "resId": "projects",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [],
                                    "name": "solutions",
                                    "path": "/flowModule/solutions",
                                    "resId": "solutions",
                                    "type": "IFolder"
                                }
                            ],
                            "name": "flowModule",
                            "path": "/flowModule",
                            "resId": "flowModule",
                            "type": "IProject"
                        },
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [],
                                            "name": "bank",
                                            "path": "/functionModule/businessComponent/bank",
                                            "resId": "bank",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [
                                                        {
                                                            "children": [],
                                                            "name": "heii",
                                                            "path": "/functionModule/businessComponent/projects/hello/heii",
                                                            "resId": "application",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/functionModule/businessComponent/projects/hello",
                                                    "resId": "project",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/functionModule/businessComponent/projects",
                                            "resId": "projects",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "solutions",
                                            "path": "/functionModule/businessComponent/solutions",
                                            "resId": "solutions",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "businessComponent",
                                    "path": "/functionModule/businessComponent",
                                    "resId": "businessComponent",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [
                                        {
                                            "children": [
                                                {
                                                    "children": [],
                                                    "name": "componentSourceCode",
                                                    "path": "/functionModule/technologyComponent/bank/componentSourceCode",
                                                    "resId": "componentSourceCode",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "dependencies",
                                                    "path": "/functionModule/technologyComponent/bank/dependencies",
                                                    "resId": "dependencies",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "lib",
                                                    "path": "/functionModule/technologyComponent/bank/lib",
                                                    "resId": "lib",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "registerInfo",
                                                    "path": "/functionModule/technologyComponent/bank/registerInfo",
                                                    "resId": "registerInfo",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "bank",
                                            "path": "/functionModule/technologyComponent/bank",
                                            "resId": "bank",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "output",
                                            "path": "/functionModule/technologyComponent/output",
                                            "resId": "output",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [],
                                                    "name": "componentSourceCode",
                                                    "path": "/functionModule/technologyComponent/platform/componentSourceCode",
                                                    "resId": "componentSourceCode",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "dependencies",
                                                    "path": "/functionModule/technologyComponent/platform/dependencies",
                                                    "resId": "dependencies",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "lib",
                                                    "path": "/functionModule/technologyComponent/platform/lib",
                                                    "resId": "lib",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [],
                                                    "name": "registerInfo",
                                                    "path": "/functionModule/technologyComponent/platform/registerInfo",
                                                    "resId": "registerInfo",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "platform",
                                            "path": "/functionModule/technologyComponent/platform",
                                            "resId": "platform",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [
                                                {
                                                    "children": [
                                                        {
                                                            "children": [
                                                                {
                                                                    "children": [],
                                                                    "name": "componentSourceCode",
                                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/componentSourceCode",
                                                                    "resId": "componentSourceCode",
                                                                    "type": "IFolder"
                                                                },
                                                                {
                                                                    "children": [],
                                                                    "name": "dependencies",
                                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/dependencies",
                                                                    "resId": "dependencies",
                                                                    "type": "IFolder"
                                                                },
                                                                {
                                                                    "children": [],
                                                                    "name": "lib",
                                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/lib",
                                                                    "resId": "lib",
                                                                    "type": "IFolder"
                                                                },
                                                                {
                                                                    "children": [],
                                                                    "name": "registerInfo",
                                                                    "path": "/functionModule/technologyComponent/projects/hello/heii/registerInfo",
                                                                    "resId": "registerInfo",
                                                                    "type": "IFolder"
                                                                }
                                                            ],
                                                            "name": "heii",
                                                            "path": "/functionModule/technologyComponent/projects/hello/heii",
                                                            "resId": "application",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "hello",
                                                    "path": "/functionModule/technologyComponent/projects/hello",
                                                    "resId": "project",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "projects",
                                            "path": "/functionModule/technologyComponent/projects",
                                            "resId": "projects",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "solutions",
                                            "path": "/functionModule/technologyComponent/solutions",
                                            "resId": "solutions",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "technologyComponent",
                                    "path": "/functionModule/technologyComponent",
                                    "resId": "technologyComponent",
                                    "type": "IFolder"
                                }
                            ],
                            "name": "functionModule",
                            "path": "/functionModule",
                            "resId": "functionModule",
                            "type": "IProject"
                        },
                        {
                            "children": [
                                {
                                    "children": [],
                                    "name": "extService",
                                    "path": "/hello/extService",
                                    "resId": "extService",
                                    "type": "IFolder"
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
                                                                    "children": null,
                                                                    "name": "sql.sql",
                                                                    "path": "/hello/heii/aaaa/config/dataConfig/sql.sql",
                                                                    "resId": "sql",
                                                                    "type": "IFile"
                                                                }
                                                            ],
                                                            "name": "dataConfig",
                                                            "path": "/hello/heii/aaaa/config/dataConfig",
                                                            "resId": "dataConfig",
                                                            "type": "IFolder"
                                                        },
                                                        {
                                                            "children": [],
                                                            "name": "documentConfig",
                                                            "path": "/hello/heii/aaaa/config/documentConfig",
                                                            "resId": "documentConfig",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "config",
                                                    "path": "/hello/heii/aaaa/config",
                                                    "resId": "config",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "children": [],
                                                            "name": "checkout",
                                                            "path": "/hello/heii/aaaa/document/checkout",
                                                            "resId": "checkout",
                                                            "type": "IFolder"
                                                        },
                                                        {
                                                            "children": [],
                                                            "name": "design",
                                                            "path": "/hello/heii/aaaa/document/design",
                                                            "resId": "design",
                                                            "type": "IFolder"
                                                        },
                                                        {
                                                            "children": [],
                                                            "name": "operation",
                                                            "path": "/hello/heii/aaaa/document/operation",
                                                            "resId": "operation",
                                                            "type": "IFolder"
                                                        },
                                                        {
                                                            "children": [],
                                                            "name": "requirement",
                                                            "path": "/hello/heii/aaaa/document/requirement",
                                                            "resId": "requirement",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "document",
                                                    "path": "/hello/heii/aaaa/document",
                                                    "resId": "document",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "children": [
                                                                {
                                                                    "children": null,
                                                                    "name": "Taaaa.java",
                                                                    "path": "/hello/heii/aaaa/flow/compileResult/Taaaa.java",
                                                                    "resId": "java",
                                                                    "type": "IFile"
                                                                },
                                                                {
                                                                    "children": null,
                                                                    "name": "heii.aaaa.jar",
                                                                    "path": "/hello/heii/aaaa/flow/compileResult/heii.aaaa.jar",
                                                                    "resId": "jar",
                                                                    "type": "IFile"
                                                                },
                                                                {
                                                                    "children": null,
                                                                    "name": "heii_aaaa.src",
                                                                    "path": "/hello/heii/aaaa/flow/compileResult/heii_aaaa.src",
                                                                    "resId": "src",
                                                                    "type": "IFile"
                                                                }
                                                            ],
                                                            "name": "compileResult",
                                                            "path": "/hello/heii/aaaa/flow/compileResult",
                                                            "resId": "compileResult",
                                                            "type": "IFolder"
                                                        },
                                                        {
                                                            "children": null,
                                                            "name": "dfc.dfc",
                                                            "path": "/hello/heii/aaaa/flow/dfc.dfc",
                                                            "resId": "dfc",
                                                            "type": "IFile"
                                                        },
                                                        {
                                                            "children": null,
                                                            "name": "flowConfig.fc",
                                                            "path": "/hello/heii/aaaa/flow/flowConfig.fc",
                                                            "resId": "fc",
                                                            "type": "IFile"
                                                        },
                                                        {
                                                            "children": null,
                                                            "name": "par.par",
                                                            "path": "/hello/heii/aaaa/flow/par.par",
                                                            "resId": "par",
                                                            "type": "IFile"
                                                        }
                                                    ],
                                                    "name": "flow",
                                                    "path": "/hello/heii/aaaa/flow",
                                                    "resId": "flow",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "children": [],
                                                            "name": "executableProgram",
                                                            "path": "/hello/heii/aaaa/run/executableProgram",
                                                            "resId": "executableProgram",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "run",
                                                    "path": "/hello/heii/aaaa/run",
                                                    "resId": "run",
                                                    "type": "IFolder"
                                                },
                                                {
                                                    "children": [
                                                        {
                                                            "children": [],
                                                            "name": "functionTest",
                                                            "path": "/hello/heii/aaaa/test/functionTest",
                                                            "resId": "functionTest",
                                                            "type": "IFolder"
                                                        },
                                                        {
                                                            "children": [],
                                                            "name": "performanceTest",
                                                            "path": "/hello/heii/aaaa/test/performanceTest",
                                                            "resId": "performanceTest",
                                                            "type": "IFolder"
                                                        }
                                                    ],
                                                    "name": "test",
                                                    "path": "/hello/heii/aaaa/test",
                                                    "resId": "test",
                                                    "type": "IFolder"
                                                }
                                            ],
                                            "name": "aaaa",
                                            "path": "/hello/heii/aaaa",
                                            "resId": "service",
                                            "type": "IFolder"
                                        },
                                        {
                                            "children": [],
                                            "name": "servicePublish",
                                            "path": "/hello/heii/servicePublish",
                                            "resId": "servicePublish",
                                            "type": "IFolder"
                                        }
                                    ],
                                    "name": "heii",
                                    "path": "/hello/heii",
                                    "resId": "application",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [],
                                    "name": "servicePublish",
                                    "path": "/hello/servicePublish",
                                    "resId": "servicePublish",
                                    "type": "IFolder"
                                }
                            ],
                            "name": "hello",
                            "path": "/hello",
                            "resId": "project",
                            "type": "IProject"
                        },
                        {
                            "children": [
                                {
                                    "children": [],
                                    "name": "projects",
                                    "path": "/publicPrototype/projects",
                                    "resId": "projects",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [],
                                    "name": "solutions",
                                    "path": "/publicPrototype/solutions",
                                    "resId": "solutions",
                                    "type": "IFolder"
                                }
                            ],
                            "name": "publicPrototype",
                            "path": "/publicPrototype",
                            "resId": "publicPrototype",
                            "type": "IProject"
                        },
                        {
                            "children": [
                                {
                                    "children": [],
                                    "name": "extService",
                                    "path": "/publicService/extService",
                                    "resId": "extService",
                                    "type": "IFolder"
                                },
                                {
                                    "children": [],
                                    "name": "servicePublish",
                                    "path": "/publicService/servicePublish",
                                    "resId": "servicePublish",
                                    "type": "IFolder"
                                }
                            ],
                            "name": "publicService",
                            "path": "/publicService",
                            "resId": "publicService",
                            "type": "IProject"
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
        components: {
            navigator: navi
        }
    }
</script>