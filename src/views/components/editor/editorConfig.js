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
var textPolicy = $AG.policy.TextPolicy('desp', function (figure) {
    //位置计算
    this.bounds = {
        x: figure.fattr('x'),
        y: figure.fattr('y')
    };
});


/***************************************右键菜单***************************************/
var selectAll = {
    id: 'selectAll',
    name: '全选',
    type: constants.ACTION_SELECTION,
    key: 'ctrl+a',
    run: function () {
        this.host.rootEditPart.setSelection(this.host.rootEditPart.children);
    }
};

var deleteItem = {
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
};

var undo = {
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
};

var redo = {
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
};

var save = {
    id: 'save',
    name: '保存',
    type: constants.ACTION_STACK,
/*    key: 'ctrl+s',*/
    check: function () {
        return this.host.isDirty();
    },
    run: function () {
        this.host.doSave();
    }
};

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
        y: figure.bounds.y + 15 + (figure.bounds.height - 15) / 2,
    })
};

let defaultData = {
    'UUID': undefined,
    'Quote': '0',
    'Type': undefined,
    'Desp': 'DefaultName',
    'RefImpl': 'DefaultName',
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
    'False': '0'
};

//默认组件
var stepCommonCpt = {
    name: 'common',
    paletteUrl: "assets/image/editor/palette_component_stepCommonCpt.gif",
    url: 'assets/image/editor/event_component_stepCommonCpt.gif',
    type: $AG.IMAGE,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    policies: {
        'doubleclick': {
            activate(){
                this.lisn = () => {this.emit(globalConstants.OPEN_FLOWPROP_DIALOG, this.getHost())};
                this.getHostFigure().on('dblclick', this.lisn);
            },
            deactivate(){
                this.getHostFigure().off('dblclick', this.lisn);
            }
        },
        
        'despText': $AG.policy.TextPolicy('Desp', location),
        
        'nodeImplement': {
            activate() {
                let self = this;
                
                this.listener = function() {
                    var host = self.getHost(), unSelected = host.getSelected() == constants.SELECTED_NONE; 
                    
                    /*单击且选中*/
                    if (unSelected) return;
                    
                    self.emit(globalConstants.OPEN_RIGHT_EDITOR, host.model);
                }
                
                this.getHostFigure().on('click', this.listener);
            },
            
            deactivate() {
                this.getHostFigure().off('click', this.listener);
            }
        }
    },

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh: refresh,

    //数据
    size: [160, 60],
    data: defaultData
};

var serviceInvokdEntered = {
    name: 'service',
    paletteUrl: 'assets/image/editor/palette_component_ServiceInvoke.gif',
    url: 'assets/image/editor/event_component_ServiceInvokdEntered.gif',
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
    refresh: refresh,
    
    policies : {
       'despText': $AG.policy.TextPolicy('Desp', location) 
    },

    //数据
    size: [160, 60],
    data: defaultData
};



//基本组件
var nodeStart = {
    name: 'start',
    url: 'assets/image/editor/event_component_nodeStart.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeStart.gif',
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
    refresh: refresh,
    
    policies : {
       'despText': $AG.policy.TextPolicy('Desp', location) 
    }
};

var nodeEnd = {
    name: 'end',
    url: 'assets/image/editor/event_component_nodeEnd.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeEnd.gif',
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
    refresh: refresh,
    
    policies : {
       'despText': $AG.policy.TextPolicy('Desp', location) 
    }
};

var nodeAbnormalEnd = {
    name: 'eend',
    url: 'assets/image/editor/event_component_nodeAbnormalEnd.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeAbnormalEnd.gif',
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
    refresh: refresh,
    
    policies : {
       'despText': $AG.policy.TextPolicy('Desp', location) 
    }
};

var nodeErrorDelegate = {
    name: 'error',
    url: 'assets/image/editor/event_component_nodeErrorDelegate.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeErrorDelegate.gif',
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
    refresh: refresh,
    
    policies : {
       'despText': $AG.policy.TextPolicy('Desp', location) 
    }
};


var componentInvoke = {
    name: 'context',
    url: 'assets/image/editor/event_component_ComponentInvoke.gif',
    paletteUrl: 'assets/image/editor/palette_component_ComponentInvoke.gif',
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
    refresh: refresh,
    
    policies : {
       'despText': $AG.policy.TextPolicy('Desp', location) 
    }
};

var tradeInvoke = {
    name: 'serivceX',
    url: 'assets/image/editor/event_node_component_TradeInvoke.gif',
    paletteUrl: 'assets/image/editor/palette_component_TradeInvoke.gif',
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
    refresh: refresh,
    
    policies : {
       'despText': $AG.policy.TextPolicy('Desp', location) 
    }
};

var transfer = {
    name: 'mid',
    url: 'assets/image/editor/event_component_transfer.gif',
    paletteUrl: 'assets/image/editor/palette_component_transfer.gif',
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
    refresh: refresh,
    
    policies : {
       'despText': $AG.policy.TextPolicy('Desp', location) 
    }
};

var leftEditorConfig = {
    id: 'mainEditor',
    children: {
        '3': serviceInvokdEntered,
        '5': stepCommonCpt,
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        0: {
            name: '默认组件',
            items: {
                '3': serviceInvokdEntered,
                '5': stepCommonCpt,
            }
        },
        1: {
            name: '银行',
            items: {}
        },
        2: {
            name: '应用',
            items: {}
        }
    },
    operations: [
        selectAll,
        deleteItem,
        undo,
        redo,
        save
    ]
};

var rightEditorConfig = {
    id: 'leftEditor',
    children: {
        '2': nodeStart,
        '3': nodeEnd,
        '4': nodeAbnormalEnd,
        '6': nodeErrorDelegate,
        '7': componentInvoke,
        '11': tradeInvoke,
        '10': transfer
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        '0': {
            name: '基本组件',
            items: {
                '2': nodeStart,
                '3': nodeEnd,
                '4': nodeAbnormalEnd,
                '6': nodeErrorDelegate,
                '7': componentInvoke,
                '11': tradeInvoke,
                '10': transfer
            }
        },
        '1': {
            name: '平台',
        },
        '2': {
            name: '银行'
        },
        '3': {
            name: '应用'
        }
    },
    operations: [
        selectAll,
        deleteItem,
        undo,
        redo,
        save
    ]
}

export {leftEditorConfig, rightEditorConfig}