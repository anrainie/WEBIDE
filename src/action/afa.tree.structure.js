import afaActions from './afa.tree.action'

module.exports = {
    generateMenu(_id){
        let menu = [],
            ids = _id.split('/'),
            curr = {children:tree},
            i = 0;

        for(let size = ids.length ; i < size ; i++){
            let id = ids[i];
            let chd = getResourceById(curr.children,id);
            if(chd){
                curr = chd;
            }else{
                if(curr.recursion && curr.id == id) {
                    continue;
                }
                break;
            }
        }

        if(i === ids.length && curr){
            menu = menu.concat(genetateMenuByRes(curr));
        }

        commonMenu.forEach(function (v,k) {
            if(v.executeEnable(curr) == true){
                menu.push(v);
            }
        })

        return menu;
    }
}

function genetateMenuByRes(res) {
    let children = res.children;
    let menu = [];
    let newItem = createNewItem();
    menu.push(newItem);

    if(res.recursion){
        let item = createItem(res);
        if(item){
            newItem.children.push(item);
        }
    }

    if(children && children.length > 0){
        children.forEach((chd,index) => {
            if(chd.create){
                let item = createItem(chd);
                if(item){
                    newItem.children.unshift(item);
                }
            }
        })
    }
    if(res.action && $.isArray(res.action)){
        menu = menu.concat(res.action);
    }
    return menu;
}

function getResourceById(arr,id) {
    for(let i = 0 , size = arr.length ; i < size ; i++){
        let chd = arr[i];
        if(chd.id === id){
            return chd;
        }
    }
}

function createItem(res) {
    if(res.create === true){
        return {
            id:res.id,
            name: res.name || res.id,
            type:'item',
            handler: function(selection,item){
                afaActions.new.handler.call(item,selection[0],item);
            }
        }
    }else if($.isPlainObject(res.create)){
        return res.create
    }
}

function createNewItem() {
    let newItem = {
        id:'new',
        name:'新建',
        type:'group',
        children:[],
    };
    let project = getResourceById(tree,'project');
    let solution = getResourceById(tree,'solution');
    newItem.children.push({
        id:'separator',
        type:'separator',
    });
    newItem.children.push(createItem(project));
    newItem.children.push(createItem(solution));
    return newItem;
}

const commonMenu = [
    {
        id:'refresh',
        name:'刷新',
        type:'item',
        handler:function (selection,item) {
            if (selection instanceof Array) {
                for (let index in selection) {
                    selection[index].refresh();
                }
            }
        },
        executeEnable(res){
            return true;
        }
    },
    {
        id:'delete',
        name:'删除',
        type:'item',
        handler:function (selection,item) {
            var path = selection[0].getParent().model.path;
            IDE.navigator.deleteItem(selection[0]);
        },
        executeEnable(res){
            return res.delete
        }
    },
]

const databaseModule = {
    'id': 'databaseModule',
    'name':'数据模块',
    'children': [
        {
            'id': 'catalog',
            'name':'分类',
            'create': true,
            'delete': true,
            'children': [
                {
                    'id': 'dbtf',
                    'name':'表文件',
                    'create': true,
                    'delete': true,
                }
            ]
        },
        {
            'id': 'dbtf',
            'name':'表文件',
            'create': true,
            'delete': true,
        }
    ]
}

const dict = {
    'id': 'dict',
    'name':'数据字典',
    'create': true,
    'delete': true,
}

const technologyTemplate = {
    'id': 'technologyTemplate',
    'children': [
        {
            'id': 'catalog',
            'name':'分类',
            'create': true,
            'delete': true,
            'children': [
                {
                    'id': 'tt',
                    'name':'技术模版',
                    'create': true,
                    'delete': true,
                }
            ]
        },
        {
            'id': 'tt',
            'name':'技术模版',
            'create': true,
            'delete': true,
        }
    ]
}

const businessTemplate = {
    'id': 'businessTemplate',
    'children': [
        {
            'id': 'catalog',
            'create': true,
            'name':'分类',
            'delete': true,
            'children': [
                {
                    'id': 'bt',
                    'name':'业务模版',
                    'create': true,
                    'delete': true,
                }
            ]
        },
        {
            'id': 'bt',
            'name':'业务模版',
            'create': true,
            'delete': true,
        }
    ]
}

const tradeTemplate = {
    'id': 'tradeTemplate',
    'children': [
        {
            'id': 'catalog',
            'name':'分类',
            'create': true,
            'children': [
                {
                    'id': 'trt',
                    'name':'交易模版',
                    'create': true,
                    'delete': true,
                }
            ]
        },
        {
            'id': 'trt',
            'name':'交易模版',
            'create': true,
            'delete': true,
        }
    ]
}

const privateTechnologyTemplate = {
    'id': 'privateTechnologyTemplate',
    'children': [
        {
            'id': 'catalog',
            'create': true,
            'name':'分类',
            'delete': true,
            'children': [
                {
                    'id': 'tt',
                    'name':'技术模版',
                    'create': true,
                    'delete': true,
                }
            ]
        },
        {
            'id': 'tt',
            'name':'技术模版',
            'create': true,
            'delete': true,
        }
    ]
}

const componentPackage = {
    'id': 'componentPackage',
    'name':'组件包',
    'create': true,
    'delete': true,
    'action':[
        afaActions.compileBcpt,
    ],
    'children': [
        {
            'id': 'bcpt',
            'name':'业务组件',
            'create': true,
            'delete': true,
        },
        {
            'id': 'compileResult',
            'children': []
        }
    ]
}

const technologyComponentArray = [
    {
        'id': 'componentSourceCode',
        'name':'组件源码',
        'action':[
            afaActions.registAllJavaTCAction,
            afaActions.packTechCptAction,
        ],
        'children': [
            {
                'id': 'py',
                'name':'py技术组件',
                'create': true,
                'delete': true,
            },
            {
                'id': 'package',
                'delete': true,
                'recursion':true,
                'name':'package',
                'create':afaActions.createJavaPackage,
                'children': [
                    {
                        'id': 'java',
                        'name':'Java技术组件',
                        'create': afaActions.createJavaComponnet,
                    }
                ],
            }
        ]
    },
    {
        'id': 'dependencies',
        'children': [
            {
                'id': 'jar',
                'delete': true,
            }
        ]
    },
    {
        'id': 'lib',
        'children': [
            {
                'id': 'jar',
                'delete': true,
            }
        ]
    },
    {
        'id': 'registerInfo',
        'children': [
            {
                'id': 'componentGroup',
                'delete': true,
                'children': [
                    {
                        'id': 'tcpt',
                        'delete': true,
                    }
                ]
            }
        ]
    }
]

const dataEntitiesArray = [
    {
        'id': 'dataEntities',
        'children': []
    },
    {
        'id': 'dataEntity',
        'create': true,
        'delete': true,
        'name':'数据实体分类',
        'children': [
            {
                'create': true,
                'delete': true,
                'id': 'edm',
                'name':'数据实体类包',
            }
        ]
    },
    {
        'id': 'srcFolder',
        'children': []
    }
]

const service = {
    'id': 'service',
    'name':'场景',
    'create': true,
    'delete': true,
    'action':[
        afaActions.compileService
    ],
    'children': [
        {
            'id': 'config',
            'children': [
                {
                    'id': 'dataConfig',
                    'children': [
                        {
                            'id': 'sql'
                        }
                    ]
                },
                {
                    'id': 'documentConfig'
                }
            ]
        },
        {
            'id': 'document',
            'children': [
                {
                    'id': 'checkout'
                },
                {
                    'id': 'design'
                },
                {
                    'id': 'operation'
                },
                {
                    'id': 'requirement'
                }
            ]
        },
        {
            'id': 'flow',
            'children': [
                {
                    'id': 'compileResult',
                    'children': [
                        {
                            'id': 'src'
                        },
                        {
                            'id': 'py'
                        },
                        {
                            'id': 'java'
                        }
                    ]
                },
                {
                    'id': 'dfc'
                },
                {
                    'id': 'fc'
                },
                {
                    'id': 'par'
                }
            ]
        },
        {
            'id': 'run',
            'children': [
                {
                    'id': 'executableProgram',
                    'children': []
                }
            ]
        },
        {
            'id': 'test',
            'children': [
                {
                    'id': 'functionTest',
                    'children': [
                        {
                            'id': 'natp',
                            'name':'NATP报文',
                            'create':true,
                            'delete': true,
                        },
                        {
                            'id': 'fpck',
                            'name':'自由报文',
                            'create':true,
                            'delete': true,
                        }
                    ]
                },
                {
                    'id': 'performanceTest',
                    'children': [
                        {
                            'id': 'natp',
                            'create':true,
                            'name':'NATP报文',
                            'delete': true,
                        },
                        {
                            'id': 'fpck',
                            'name':'自由报文',
                            'create':true,
                            'delete': true,
                        }
                    ]
                }
            ]
        }
    ]
}

const tree = [
    {
        'id': 'dataModule',
        'children': [
            {
                'id': 'databaseTable',
                'children': [
                    {
                        'id': 'projects',
                        'children': [
                            {
                                'id': 'project',
                                'name':'项目',
                                'create': true,
                                'delete': true,
                                'children': [
                                    {
                                        'id': 'application',
                                        'name':'服务',
                                        'create': true,
                                        'delete': true,
                                        'children': [
                                            databaseModule
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'id': 'solutions',
                        'children': [
                            {
                                'id': 'solution',
                                'name':'解决方案',
                                'create': true,
                                'delete': true,
                                'children': [
                                    {
                                        'id': 'product',
                                        'create': true,
                                        'name':'产品',
                                        'delete': true,
                                        'children': [
                                            databaseModule
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                'id': 'datadict',
                'children': [
                    {
                        'id': 'bank',
                        'children': [
                            dict
                        ]
                    },
                    {
                        'id': 'platform',
                        'children': [
                            dict
                        ]
                    },
                    {
                        'id': 'projects',
                        'children': [
                            {
                                'id': 'project',
                                'name':'项目',
                                'create': true,
                                'delete': true,
                                'children': [
                                    {
                                        'id': 'application',
                                        'name':'服务',
                                        'create': true,
                                        'delete': true,
                                        'children': [
                                            dict
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'id': 'solutions',
                        'children': [
                            {
                                'id': 'solution',
                                'name':'解决方案',
                                'create': true,
                                'delete': true,
                                'children': [
                                    {
                                        'id': 'product',
                                        'name':'产品',
                                        'create': true,
                                        'delete': true,
                                        'children': [
                                            dict
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                'id': 'dataInterface',
                'children': [
                    {
                        'id': 'bank',
                        'children': [
                            {
                                'id': 'documentInterface',
                                'children': []
                            },
                            {
                                'id': 'messageInterface',
                                'children': []
                            }
                        ]
                    },
                    {
                        'id': 'output',
                        'children': [
                            {
                                'id': 'jar'
                            }
                        ]
                    },
                    {
                        'id': 'projects',
                        'children': [
                            {
                                'id': 'project',
                                'children': [
                                    {
                                        'id': 'application',
                                        'children': [
                                            {
                                                'id': 'documentInterface',
                                                'children': []
                                            },
                                            {
                                                'id': 'messageInterface',
                                                'children': []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'id': 'solutions',
                        'children': []
                    }
                ]
            },
            {
                'id': 'dataObject',
                'children': [
                    {
                        'id': 'bank',
                        'children': dataEntitiesArray,
                    },
                    {
                        'id': 'projects',
                        'children': [
                            {
                                'id':'project',
                                'name':'项目',
                                'create': true,
                                'delete': true,
                                'children':[
                                    {
                                        'id': 'application',
                                        'name':'服务',
                                        'create': true,
                                        'delete': true,
                                        'children': dataEntitiesArray,
                                    }
                                ],
                            }
                        ]
                    },
                    {
                        'id': 'solutions',
                        'children': [
                            {
                                'id': 'solution',
                                'name':'解决方案',
                                'create': true,
                                'delete': true,
                                'children': [
                                    {
                                        'id': 'product',
                                        'name':'产品',
                                        'create': true,
                                        'delete': true,
                                        'children': dataEntitiesArray,
                                    }
                                ],
                            }
                        ]
                    },
                    {
                        'id': 'output',
                        'children': [
                            {'id': '.jar'}
                        ]
                    },
                ]
            }
        ]
    },
    {
        'id': 'flowModule',
        'children': [
            {
                'id': 'platform',
                'children': [
                    technologyTemplate,
                    businessTemplate,
                    tradeTemplate,
                ]
            },
            {
                'id': 'bank',
                'children': [
                    technologyTemplate,
                    businessTemplate,
                    tradeTemplate,
                ]
            },
            {
                'id': 'projects',
                'children': [
                    {
                        'id': 'project',
                        'name':'项目',
                        'create': true,
                        'delete': true,
                        'children': [
                            {
                                'id': 'application',
                                'name':'服务',
                                'create': true,
                                'delete': true,
                                'children': [
                                    technologyTemplate,
                                    businessTemplate,
                                    tradeTemplate,
                                ]
                            },
                            technologyTemplate,
                            businessTemplate,
                            tradeTemplate,
                        ]
                    }
                ]
            },
            {
                'id': 'solutions',
                'children': [
                    {
                        'id': 'solution',
                        'name':'解决方案',
                        'create': true,
                        'delete': true,
                        'children': [
                            {
                                'id': 'product',
                                'name':'产品',
                                'create': true,
                                'delete': true,
                                'children': [
                                    technologyTemplate,
                                    businessTemplate,
                                    tradeTemplate,
                                ]
                            },
                            technologyTemplate,
                            businessTemplate,
                            tradeTemplate,
                        ]
                    }
                ]
            },
        ]
    },
    {
        'id': 'functionModule',
        'children': [
            {
                'id': 'businessComponent',
                'children': [
                    {
                        'id': 'bank',
                        'action':[
                            afaActions.compileBcpt,
                        ],
                        'children': [
                            componentPackage
                        ]
                    },
                    {
                        'id': 'projects',
                        'children': [
                            {
                                'id': 'project',
                                'name':'项目',
                                'create': true,
                                'delete': true,
                                'children': [
                                    {
                                        'id': 'application',
                                        'name':'应用',
                                        'create': true,
                                        'delete': true,
                                        'children': [
                                            componentPackage
                                        ],
                                        'action':[
                                            afaActions.compileBcpt,
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'id': 'solutions',
                        'children': [
                            {
                                'id': 'solution',
                                'name':'解决方案',
                                'create': true,
                                'delete': true,
                                'children': [
                                    {
                                        'id': 'product',
                                        'name':'产品',
                                        'create': true,
                                        'delete': true,
                                        'children': [
                                            componentPackage
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                'id': 'technologyComponent',
                'children': [
                    {
                        'id': 'bank',
                        'children': technologyComponentArray,
                    },

                    {
                        'id': 'platform',
                        'children': technologyComponentArray
                    },
                    {
                        'id': 'projects',
                        'children': [
                            {
                                'id': 'project',
                                'name':'项目',
                                'create': true,
                                'delete': true,
                                'children':[
                                    {
                                        'id':'application',
                                        'create':true,
                                        'delete':true,
                                        'name':'应用',
                                        'children': technologyComponentArray
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'id': 'solutions',
                        'children': [
                            {
                                'id': 'solution',
                                'name':'解决方案',
                                'create': true,
                                'delete': true,
                                'children': [
                                    {
                                        'id': 'product',
                                        'name':'产品',
                                        'create': true,
                                        'delete': true,
                                        'children': technologyComponentArray
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'id': 'output',
                        'children': []
                    },

                ]
            }
        ]
    },
    {
        'id': 'project',
        'name':'项目',
        'create': true,
        'delete': true,
        'children': [
            {
                'id': 'application',
                'name':'应用',
                'create': true,
                'delete': true,
                'children': [
                    {
                        'id': 'serviceCatalog',
                        'name':'分类',
                        'create': true,
                        'delete': true,
                        'children': [
                            service
                        ],
                        'action':[
                            afaActions.compileService
                        ]
                    },
                    service
                ],
                'action':[
                    afaActions.compileService
                ]
            },
            {
                'id': 'extService',
                'children': []
            },
            {
                'id': 'servicePublish',
                'children': []
            }
        ]
    },
    {
        'id': 'solution',
        'name':'解决方案',
        'create': true,
        'delete': true,
        'children': [
            {
                'id': 'product',
                'name':'产品',
                'create': true,
                'delete': true,
                'children': [
                    {
                        'id': 'serviceCatalog',
                        'name':'分类',
                        'create': true,
                        'delete': true,
                        'children': [
                            service
                        ],
                        'action':[
                            afaActions.compileService
                        ]
                    },
                    service
                ],
                'action':[
                    afaActions.compileService
                ]
            },
            {
                'id': 'extService',
                'children': []
            },
            {
                'id': 'servicePublish',
                'children': []
            }
        ]
    },
    {
        'id': 'publicWorkflow',
        'children': [
            {
                'children': [
                    {
                        'children': [
                            {
                                'id': 'bpmn2d'
                            }
                        ]
                    }
                ]
            },
            {
                'id': 'dependencies',
                'children': []
            },
            {
                'id': 'document',
                'children': []
            },
            {
                'id': 'output',
                'children': []
            },
            {
                'id': 'srcFolder',
                'children': []
            },
            {
                'id': 'workflowConf',
                'children': [
                    {
                        'id': 'bpmn'
                    }
                ]
            }
        ]
    }
];
