import {$AG} from 'anrajs/src/anra.flow'
import * as constants from 'anrajs/src/anra.constants'
import srouter from 'anrajs/src/smoothRouter'

var refresh = function () {
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
    key: 'ctrl+s',
    check: function () {
        return this.host.isDirty();
    },
    run: function () {
        this.host.doSave();
    }
};

/***************************************  节点  ***************************************/

//默认组件
var commonCpt = {
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
        {id: 'C', dir: 'c', offset: 0}
    ],
    policies: {
        'doubleclick': {
            activate(){
                let self = this;
                this.lisn = function () {
                    self.emit('openDialog', self.getHost());
                };
                this.getHostFigure().on('dblclick', this.lisn);

            },
            deactivate(){
                this.getHostFigure().off('dblclick', this.lisn);
            }
        },
        
        'despText': $AG.policy.TextPolicy('Desp', function(figure){
            this.setBounds({
                x: figure.bounds.x + 80,
                y: figure.bounds.y + 30,
                width: figure.bounds.width,
                height: figure.bounds.height
            })
        }),
        
        'implement': {
            activate() {
                let self = this;
                this.listener = new $AG.EditPartListener();
                this.listener.selectedStateChanged = function(editPart) {
                    if (editPart.getSelected() != constants.SELECTED) return;
                    
                    self.emit('openRightEditor');
                }
            },
            
            deactivate() {
                this.getHostFigure.off('click', this.listener);
            }
        }
    },
    size: [160, 60],

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh: refresh,
};

var serviceCpt = {
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
    refresh: refresh
};



//基本组件


var end = {
    name: 'end',
    url: 'assets/image/editor/event_component_nodeEnd.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeEnd.gif',
    type: $AG.IMAGE,
    size: [25, 25],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 0, dir: 'n', offset: 0},
        {id: 1, dir: 's', offset: 0},
        {id: 2, dir: 'e', offset: 0},
        {id: 3, dir: 'w', offset: 0}
    ],
    refresh: refresh
};

var eend = {
    name: 'eend',
    url: 'assets/image/editor/event_component_nodeAbnormalEnd.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeAbnormalEnd.gif',
    type: $AG.IMAGE,
    size: [50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 0, dir: 'n', offset: 0},
        {id: 1, dir: 's', offset: 0},
        {id: 2, dir: 'e', offset: 0},
        {id: 3, dir: 'w', offset: 0}
    ],
    refresh: refresh
};

var error = {
    name: 'error',
    url: 'assets/image/editor/palette_component_nodeErrorDelegate.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeErrorDelegate.gif',
    type: $AG.IMAGE,
    size: [50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 0, dir: 'n', offset: 0},
        {id: 1, dir: 's', offset: 0},
        {id: 2, dir: 'e', offset: 0},
        {id: 3, dir: 'w', offset: 0}
    ],
    refresh: refresh
};

var start = {
    name: 'start',
    url: 'assets/image/editor/event_component_nodeStart.gif',
    paletteUrl: 'assets/image/editor/palette_component_nodeStart.gif',
    type: $AG.IMAGE,
    size: [200, 200],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 0, dir: 'n', offset: 0},
        {id: 1, dir: 's', offset: 0},
        {id: 2, dir: 'e', offset: 0},
        {id: 3, dir: 'w', offset: 0}
    ],
    refresh: refresh,
    policies: {
        'layoutPolicy': $AG.ContainerLayoutPolicy
    },
    children: {
        '7': end,
        '8': eend
    }
};

var context = {
    name: 'context',
    url: 'assets/image/editor/palette_component_ComponentInvoke.gif',
    paletteUrl: 'assets/image/editor/palette_component_ComponentInvoke.gif',
    type: $AG.IMAGE,
    size: [50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 0, dir: 'n', offset: 0},
        {id: 1, dir: 's', offset: 0},
        {id: 2, dir: 'e', offset: 0},
        {id: 3, dir: 'w', offset: 0}
    ],
    refresh: refresh
};

var serivceX = {
    name: 'serivceX',
    url: 'assets/image/editor/palette_component_TradeInvoke.gif',
    paletteUrl: 'assets/image/editor/palette_component_TradeInvoke.gif',
    type: $AG.IMAGE,
    size: [50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 0, dir: 'n', offset: 0},
        {id: 1, dir: 's', offset: 0},
        {id: 2, dir: 'e', offset: 0},
        {id: 3, dir: 'w', offset: 0}
    ],
    refresh: refresh
};

var mid = {
    name: 'mid',
    url: 'assets/image/editor/palette_component_transfer.gif',
    paletteUrl: 'assets/image/editor/palette_component_transfer.gif',
    type: $AG.IMAGE,
    size: [50, 50],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 0, dir: 'n', offset: 0},
        {id: 1, dir: 's', offset: 0},
        {id: 2, dir: 'e', offset: 0},
        {id: 3, dir: 'w', offset: 0}
    ],
    refresh: refresh
};

var FlowEditor = {
    id: 'mainEditor',
    children: {
        '3': serviceCpt,
        '5': commonCpt,
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        0: {
            name: '默认组件',
            items: {
                '3': serviceCpt,
                '5': commonCpt,
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

var AnthorEditor = {
    id: 'gg',
    children: {
        '0': start,
        '3': error,
        '4': context,
        '5': serivceX,
        '6': mid
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        0: {
            name: '基本组件',
            items: {
                '0': start,
                '1': end,
                '2': eend,
                '3': error,
                '4': context,
                '5': serivceX,
                '6': mid
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

export {FlowEditor, AnthorEditor}