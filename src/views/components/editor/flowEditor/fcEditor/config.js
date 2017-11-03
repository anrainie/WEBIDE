import {$AG, constants, smoothRouter} from 'anrajs'
import * as globalConstants from 'Constants'

var refresh = function () {
    if (this.model && this.figure) {
        var b = this.model.get('bounds');
        this.figure.bounds = {
            x: b[0],
            y: b[1],
            width: b[2],
            height: b[3]
        };
        this.figure.style.fill = this.model.get('color');
    }
    this.figure.paint();
};

var manhattanRoute = {
    style: {
        stroke: 'green',
        'stroke-width': 3
    },
    type: $AG.CURVE_LINE,
    router: smoothRouter(),
    endMarker: {
        type: $AG.Marker.TRIANGLE,
        size: 3
    },
    selectable: true
};

//策略
var openPropEditor = {
    activate(){
        this.lisn = () => {
            debugger;
            this.emit(globalConstants.OPEN_FLOWPROP_DIALOG, this.getHost())
        };
        this.getHostFigure().on('dblclick', this.lisn);
    },
    deactivate(){
        this.getHostFigure().off('dblclick', this.lisn);
    }
};

var openNodeEditor = {
    activate() {
        let self = this;

        this.listener = function () {
            var host = self.getHost(), unSelected = host.getSelected() == constants.SELECTED_NONE;

            /*单击且选中*/
            if (unSelected) return;

            self.emit(globalConstants.OPEN_NODE_EDITOR, host.model);
        }

        this.getHostFigure().on('mousedown', this.listener);
    },

    deactivate() {
        this.getHostFigure().off('mousedown', this.listener);
    }
}

var closeNodeEditor = {
    activate() {
        let self = this;

        this.listener = function () {
            var host = self.getHost(), unSelected = host.getSelected() == constants.SELECTED_NONE;

            /*单击且选中*/
            if (unSelected) return;

            self.emit(globalConstants.CLOSE_NODE_EDITOR);
        }

        this.getHostFigure().on('mousedown', this.listener);
    },

    deactivate() {
        this.getHostFigure().off('mousedown', this.listener);
    }
}

var pinHandle = $AG.Handle.extend($AG.CIRCLE).extend({
    constructor(editPart, anchorId) {
        $AG.Handle.prototype.constructor.call(this, editPart);
        this.anchorId = anchorId;
    },
    initProp() {
        let anchor = this.editPart.getSourceAnchorByTerminal(this.anchorId);

        if (anchor) {
            this.setOpacity(1);

            this.setAttribute({
                "stroke": "black",
                "stroke-width": 2,
                "fill": this.colorMap[this.anchorId]
            });
            this.setStyle({'cursor': 'move'});

            this.setBounds({
                x: anchor.x,
                y: anchor.y,
                width: 10
            }, true);
        }
    },
    colorMap: {
        "0": "red",
        "1": "green",
        "2": "yellow"
    },
    refreshLocation: function (figure) {
        var anchor = figure.getSourceAnchorByTerminal(this.anchorId);
        this.setBounds({
            x: anchor.x,
            y: anchor.y,
            width: 10
        });
    }
});

var pinPolicy = function (idList) {
    return {
        activate() {
            if (idList) {
                this.handles = idList.map((id) => (new pinHandle(this.getHost(), id)));
                this.handles.forEach((item) => {
                    this.getHandleLayer().addChild(item);
                    item.disableEvent();
                });
            }
        },

        deactivate() {
            if (this.handles) {
                this.handles.forEach((item) => {
                    this.getHandleLayer().removeChild(item);
                });
            }
        }
    }
};

/***************************************右键菜单***************************************/
var operations = [

    /*全选*/
    {
        id: 'selectAll',
        name: '全选',
        type: constants.ACTION_SELECTION,
        key: 'ctrl+a',
        run: function () {
            this.host.rootEditPart.setSelection(this.host.rootEditPart.children);
        }
    },

    {
        id: 'delete',
        name: '删除',
        type: constants.ACTION_SELECTION,
        key: 'delete',
        check: function () {
            return this.selection instanceof $AG.NodeEditPart ||
                this.selection instanceof $AG.LineEditPart ||
                (this.selection instanceof Array && this.selection.length > 0);
        },
        run: function () {
            var cmd, selection = this.selection,
                root = selection instanceof Array ? selection[0].getRoot() : selection.getRoot();

            if (selection instanceof $AG.NodeEditPart || selection instanceof Array) {
                cmd = new $AG.DeleteNodeAndLineCommand(root, selection);
            } else {
                cmd = new $AG.DeleteLineCommand(root, selection);
            }

            if (cmd != null) {
                root.editor.execute(cmd);
            }
            root.setSelection(null);
        }
    },

    {
        id: 'undo',
        name: '撤销',
        type: constants.ACTION_STACK,
        key: 'ctrl+z',
        check: function () {
            return this.host.cmdStack.canUndo();
        },
        run: function () {
            this.host.cmdStack.undo();
        }
    },

    {
        id: 'redo',
        name: '重做',
        type: constants.ACTION_STACK,
        key: 'ctrl+y',
        check: function () {
            return this.host.cmdStack.canRedo();
        },
        run: function () {
            this.host.redo();
        }
    },

    {
        id: 'save',
        name: '保存',
        type: constants.ACTION_STACK,
        check: function () {
            return this.host.isDirty();
        },
        run: function () {
            this.host.doSave();
        }
    }

];


/***************************************  节点  ***************************************/

/*暂时使用的desp位置*/
var location = function (figure) {
    var text = this.text,
        length;

    if (text == null) {
        length = 0
    } else {
        if (typeof text != "string") text += "";

        length = text.replace(/[^\x00-\xff]/g, "01").length;
    }

    this.setBounds({
        x: figure.bounds.x + (figure.bounds.width - 7.5 * length) / 2,
        y: figure.bounds.y + (figure.bounds.height + 15) / 2,
    })
};

/*暂时使用的ID位置*/
var idLocation = function (figure) {
    var text = this.text;

    this.setBounds({
        x: figure.bounds.x + 20,
        y: figure.bounds.y + 15 + (figure.bounds.height - 15) / 2,
    })
}

let defaultData = {
    'UUID': undefined,
    'Quote': '0',
    'Type': undefined,
    'Desp': null,
    'RefImpl': null,
    'Skip': {
        'Enabled': '0',
        'Branch': '1'
    },
    'HasSql': 'false',
    'Constraint': {
        'Location': null,
        'Size': '160,60'
    },
    'Terminals': {
        'Name': '0',
        'Desp': '失败'
    },
    'True': '0',
    'False': '0',
    'Terminals' : {
        'Terminal': [
            {
                'name': '0',
                'Desp': '失败'
            },
            {
                'name': '1',
                'Desp': '成功'
            }
        ]
    }
};

/****** step ******/

/*默认组件*/

//通用组件
var stepCommonCpt = {
    name: 'common',
    url: '/assets/image/editor/event_component_stepCommonCpt.gif',
    type: $AG.IMAGE,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    policies: {
        'doubleclick': openPropEditor,

        'despText': $AG.policy.TextPolicy('Desp', location),

        'nodeEditor': openNodeEditor,

        'pin': pinPolicy(['0', '1']),

        'idText': $AG.policy.TextPolicy('id', idLocation)
    },

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh,

    //数据
    size: [160, 60]
};

//内部场景调用
var serviceInvokdEntered = {
    name: 'service',
    url: '/assets/image/editor/event_component_ServiceInvokdEntered.gif',
    type: $AG.IMAGE,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0}
    ],
    size: [160, 60],

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'nodeEditor': closeNodeEditor,
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    },

};

//多出口组件
var stepMultiOutletCpt = {
    url: '/assets/image/editor/event_component_stepMultiOutletCpt.gif',
    type: $AG.IMAGE,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0}
    ],
    size: [160, 60],

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'nodeEditor': openNodeEditor,
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    },
};

//业务组件
var bcpt = {
    url: '/assets/image/editor/event_component_stepBussiness.gif',
    type: $AG.IMAGE,
    size: [160, 46],
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    policies: {
        'doubleclick': openPropEditor,

        'despText': $AG.policy.TextPolicy('Desp', location),

        'nodeEditor': openNodeEditor,

        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }

}

/***** node *****/

//基本组件

//开始
var nodeStart = {
    name: 'start',
    desc: '开始',
    url: '/assets/image/editor/event_component_nodeStart.gif',
    type: $AG.IMAGE,
    size: [63, 63],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '1', dir: 's', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

//正常结束
var nodeEnd = {
    name: 'end',
    desc: '结束',
    url: '/assets/image/editor/event_component_nodeEnd.gif',
    type: $AG.IMAGE,
    size: [63, 63],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '1', dir: 's', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

//异常结束
var nodeAbnormalEnd = {
    name: 'eend',
    desc: '异常结束',
    url: '/assets/image/editor/event_component_nodeAbnormalEnd.gif',
    type: $AG.IMAGE,
    size: [63, 63],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '1', dir: 's', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

//自定义结束
var nodeCustomEnd = {
    url: '/assets/image/editor/event_component_nodeCustomEnd.gif',
    type: $AG.IMAGE,
    size: [63, 63],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '1', dir: 's', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

//默认逻辑委托错误
var nodeErrorDelegate = {
    name: 'error',
    desc: '默认逻辑错误委托',
    url: '/assets/image/editor/event_component_nodeErrorDelegate.gif',
    type: $AG.IMAGE,
    size: [160, 54],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
    ],
    refresh,

    policies: {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

//组件调用
var componentInvoke = {
    name: 'context',
    desc: '组件调用',
    url: '/assets/image/editor/event_component_ComponentInvoke.gif',
    type: $AG.IMAGE,
    size: [160, 44],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

//内部场景调用
var tradeInvoke = {
    name: 'serivceX',
    desc: '内部场景调用',
    url: '/assets/image/editor/event_node_component_TradeInvoke.gif',
    type: $AG.IMAGE,
    size: [160, 44],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

//中转节点
var transfer = {
    name: 'mid',
    desc: '中转节点',
    url: '/assets/image/editor/event_component_transfer.gif',
    type: $AG.IMAGE,
    size: [63, 63],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '1', dir: 's', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

//场景同步调用
var tradeSync = {
    url: '/assets/image/editor/event_node_component_tradeSync.gif',
    type: $AG.IMAGE,
    size: [160, 44],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

var Async = {
    url: '/assets/image/editor/event_node_component_Async.gif',
    type: $AG.IMAGE,
    size: [160, 44],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
};

var parallel = {
    url: '/assets/image/editor/Parallel_leave.gif',
    type: $AG.IMAGE,
    size: [40, 160],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: 0}
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
}

var tcpt = {
    url: "assets/image/editor/event_component_nodeTechnology.gif",
    type: $AG.IMAGE,
    size: [160, 46],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    }
}

/***** 编辑器配置 *****/

let createStepData = function (config) {
    return Object.assign(config, defaultData);
}

/*step画板配置*/
let stepDefaultComponent = {
    name: '默认组件',
    items: [
        {
            name: "通用组件",
            url: "/assets/image/editor/palette_component_stepCommonCpt.gif",
            data: createStepData({type: '5', size: [160, 60]})
        },
        {
            name: "内部场景调用",
            url: "/assets/image/editor/palette_component_ServiceInvoke.gif",
            data: createStepData({type: '3', size: [160, 60]})
        },
        {
            name: "多出口组件",
            url: "/assets/image/editor/palette_component_stepMultiOutletCpt.gif",
            data: createStepData({type: '7', size: [160, 60]})
        }
    ]
}

/*step编辑器配置*/
export const stepBaseCfg = {
    id: 'stepEditor',
    children: {
        '3': serviceInvokdEntered,
        '5': stepCommonCpt,
        '7': stepMultiOutletCpt,
        '4': bcpt
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        "default": stepDefaultComponent,
        "bank": {
            name: '银行',
            children: []
        },
        "application": {
            name: '应用',
            children: []
        }
    },
    operations
};

/*node画板配置*/
let nodeDefaultComponent = {
    name: '默认组件',
    items: [
        {
            name: "开始",
            url: "/assets/image/editor/palette_component_nodeStart.gif",
            data: createStepData({type: '2', size: [63, 63]})
        },
        {
            name: "正常结束",
            url: "/assets/image/editor/palette_component_nodeEnd.gif",
            data: createStepData({type: '3', size: [63, 63]})
        },
        {
            name: "异常结束",
            url: "/assets/image/editor/palette_component_nodeAbnormalEnd.gif",
            data: createStepData({type: '4', size: [63, 63]})
        },
        {
            name: "自定义结束",
            url: "/assets/image/editor/palette_component_nodeCustomEnd.gif",
            data: createStepData({type: '14', size: [63, 63]})
        },
        {
            name: "默认逻辑错误委托",
            url: "/assets/image/editor/palette_component_nodeErrorDelegate.gif",
            data: createStepData({type: '6', size: [160, 54]})
        },
        {
            name: "组件调用",
            url: "/assets/image/editor/palette_component_ComponentInvoke.gif",
            data: createStepData({type: '7', size: [160, 54]})
        },
        {
            name: "内部场景调用",
            url: "/assets/image/editor/palette_component_TradeInvoke.gif",
            data: createStepData({type: '12', size: [160, 44]})
        },
        {
            name: "中转节点",
            url: "/assets/image/editor/palette_component_transfer.gif",
            data: createStepData({type: '10', size: [63, 63]})
        }
    ],
    group: [
        {
            name: "场景同步调用",
            url: "/assets/image/editor/palette_component_tradeSync.gif",
            data: createStepData({type: '18', size: [160, 44]})
        },
        {
            name: "场景异步调用",
            url: "assets/image/editor/palette_component_tradeAsync.gif",
            data: createStepData({type: '111', size: [160, 44]})
        },
        {
            name: "平行组件",
            url: "/assets/image/editor/Parallel.gif",
            data: createStepData({type: '17', size: [40, 160]})
        }
    ]
}

/*node编辑器配置*/
export const nodeBaseCfg = {
    id: 'nodeEditor',
    children: {
        '2': nodeStart,
        '3': nodeEnd,
        '4': nodeAbnormalEnd,
        '14': nodeCustomEnd,
        '6': nodeErrorDelegate,
        '7': componentInvoke,
        '12': tradeInvoke,
        '10': transfer,
        '18': tradeSync,
        '111': Async,
        '17': parallel,
        '11': tcpt
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        'default': nodeDefaultComponent,
        'platform': {
            name: '平台',
            children: []
        },
        'bank': {
            name: '银行',
            children: []
        },
        'application': {
            name: '应用',
            children: []
        }
    },
    operations
};
