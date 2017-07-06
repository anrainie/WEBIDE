import {$AG} from './anra.flow'
import * as constants from './anra.constants'
import srouter from './smoothRouter'

var refresh = function() {
    if (this.model != null && this.figure != null) {
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
    router: srouter(),
    endMarker: {
        type: $AG.Marker.TRIANGLE,
        size: 3
    }
};

//策略
var textPolicy = $AG.policy.TextPolicy('desp', function (figure) {
    //位置计算
    this.bounds = {
        x: figure.fattr('x'),
        y: figure.fattr('y')};
});


//右键菜单
var selectAll = {
    id: 'selectAll',
    name: '全选',
    type: constants.ACTION_SELECTION,
    key: 'ctrl+a',
    run: function() {
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
               this.selection instanceof Array;
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
    check: function() {
        return this.host.cmdStack.canUndo();
    },
    run: function() {
        this.host.cmdStack.undo();
    }
};

var redo = {
    id: 'redo',
    name: '重做',
    type: constants.ACTION_STACK,
    key: 'ctrl+y',
    check: function() {
        return this.host.cmdStack.canRedo();
    },
    run: function() {
        this.host.redo();
    }
};

var save = {
    id: 'save',
    name: '保存',
    type: constants.ACTION_STACK,
    key: 'ctrl+s',
    check: function() {
        return this.host.isDirty();
    },
    run: function() {
        this.host.doSave();
    }
};


var commonCpt = {
    name: 'common',
    paletteUrl: "assets/image/editor/palette_component_stepCommonCpt.gif",
    url:'assets/image/editor/event_component_stepCommonCpt.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 160, 46],
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0}
    ],
    
    
    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh : refresh,
    
    
    policies: {
        'TextPolicy': textPolicy
    }
};

var serviceCpt = {
    name: 'service',
    paletteUrl: 'assets/image/editor/palette_component_ServiceInvoke.gif',
    url:'assets/image/editor/event_component_ServiceInvokdEntered.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 160, 46],
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0}
    ],
    
    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh : refresh
};

var commonNodeConfig = {
    name: 'common',
    url: 'assets/image/editor/palette_component_ServiceInvoke.gif',
    paletteUrl: 'assets/image/editor/palette_component_ServiceInvoke.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

var serviceNodeConfig = {
    name: 'service',
    url: 'assets/image/editor/palette_component_stepCommonCpt.gif',
    paletteUrl: 'assets/image/editor/palette_component_stepCommonCpt.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

//组三
var start = {
    name: 'start',
    url: 'assets/image/editor/palette_component_nodeStart.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeStart.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

var end = {
    name: 'end',
    url: 'assets/image/editor/palette_component_nodeEnd.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeEnd.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

var eend = {
    name: 'eend',
    url: 'assets/image/editor/palette_component_nodeAbnormalEnd.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeAbnormalEnd.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

var error = {
    name: 'error',
    url: 'assets/image/editor/palette_component_nodeErrorDelegate.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeErrorDelegate.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

var context = {
    name: 'context',
    url: 'assets/image/editor/palette_component_ComponentInvoke.gif',
    paletteUrl: 'assets/image/editor/palette_component_ComponentInvoke.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

var serivceX = {
    name: 'serivceX',
    url: 'assets/image/editor/palette_component_TradeInvoke.gif',
    paletteUrl: 'assets/image/editor/palette_component_TradeInvoke.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

var mid = {
    name: 'mid',
    url: 'assets/image/editor/palette_component_transfer.gif',
    paletteUrl: 'assets/image/editor/palette_component_transfer.gif',
    type: $AG.IMAGE,
    bounds: [0, 0, 50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
            {id: 0, dir: 'n', offset: 0},
            {id: 1, dir: 's', offset: 0},
            {id: 2, dir: 'e', offset: 0},
            {id: 3, dir: 'w', offset: 0}
    ],
    refresh : refresh
};

var FlowEditor = {
    id: 'mainEditor',
    children: {
        '3': commonCpt,
        '4': serviceCpt,
        '5': serviceCpt,
        '6': commonNodeConfig,
        '7': serviceNodeConfig,
        '8':  start,
        '9':  end,
        '10': eend,
        '11': error,
        '12': context,
        '13': serivceX,
        '14': mid,
    },
    lines: {
        0 : manhattanRoute
    },
    group: {
        0: {
            name: '组一',
            items: ['3', '4', '5']
        },
        1: {
            name: '组二',
            items: ['6', '7']
        },
        2: {
            name: '组三',
            items: ['8', '9', '10', '11', '12', '13', '14']
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

export {FlowEditor}