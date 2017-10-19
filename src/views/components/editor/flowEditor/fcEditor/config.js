import {$AG, constants, smoothRouter} from 'anrajs'
import * as globalConstants from 'Constants'
import {resolveEditorData, resolveEditorLine} from './resolve'

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
                });
            }
        },

        dectivate() {
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
        /*    key: 'ctrl+s',*/
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
      desc: '通用组件',
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

        'nodeEditor': openNodeEditor,

        'pin': pinPolicy(['0', '1'])
    },

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh,

    //数据
    size: [160, 60],
    data: defaultData
};

var serviceInvokdEntered = {
    name: 'service',
    desc: '内部场景调用',
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
    refresh,

    policies : {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'nodeEditor': closeNodeEditor,
        'pin': pinPolicy(['0', '1'])
    },

    //数据
    size: [160, 60],
    data: defaultData
};

//多出口组件
var multiOutletCpt = {
  name: 'multiOutletCpt',
  desc: '多出口组件',
  paletteUrl: 'assets/image/editor/palette_component_stepMultiOutletCpt.gif',
  url: 'assets/image/editor/event_component_stepMultiOutletCpt.gif',
  type: $AG.IMAGE,
  anchor: [
    {id: 'N', dir: 'n', offset: 0},
    {id: 'E', dir: 'e', offset: 0},
    {id: 'W', dir: 'w', offset: 0}
  ],
  size: [160, 60],

  //特性
  canDrag: true,
  linkable: true,
  selectable: true,
  refresh,

  policies : {
    'despText': $AG.policy.TextPolicy('Desp', location),
    'nodeEditor': closeNodeEditor,
    'pin': pinPolicy([])
  },

  //数据
  size: [160, 60],
  data: defaultData
};

//基本组件
var nodeStart = {
    name: 'start',
    desc: '开始',
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
    refresh,

    policies : {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1'])
    }
};


var nodeEnd = {
    name: 'end',
    desc: '结束',
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
    refresh,

    policies : {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1'])
    }
};

var nodeAbnormalEnd = {
    name: 'eend',
    desc: '异常结束',
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
    refresh,

    policies : {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1'])
    }
};
var customEnd = {
  name: 'customEnd',
  desc: '自定义结束',
  url: 'assets/image/editor/event_component_nodeCustomEnd.gif',
  paletteUrl: 'assets/image/editor/palette_component_nodeCustomEnd.gif',
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

  policies : {
    'despText': $AG.policy.TextPolicy('Desp', location),
    'pin': pinPolicy(['1'])
  }
};
var nodeErrorDelegate = {
    name: 'error',
    desc: '默认逻辑错误委托',
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
    refresh,

    policies : {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1'])
    }
};


var componentInvoke = {
    name: 'context',
    desc: '组件调用',
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
    refresh,

    policies : {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1'])
    }
};

var tradeInvoke = {
    name: 'serivceX',
    desc: '内部场景调用',
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
    refresh,

    policies : {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1'])
    }
};

var transfer = {
    name: 'mid',
    desc: '中转节点',
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
    refresh,

    policies : {
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1'])
    }
};

///场景同步调用
var syncInvoke = {
  name: 'syncInvoke',
  desc: '场景同步调用',
  url: 'assets/image/editor/event_node_component_tradeSync.gif',
  paletteUrl: 'assets/image/editor/palette_component_tradeSync.gif',
  type: $AG.IMAGE,
  size: [160, 44],
  canDrag: true,
  linkable: true,
  selectable: true,
  anchor: [
    {id: 'N', dir: 'n', offset: 0},
    {id: '0', dir: 's', offset: -50},
    {id: '1', dir: 's', offset: 0},
    {id: '2', dir: 's', offset: 50},
    {id: 'E', dir: 'e', offset: 0},
    {id: 'W', dir: 'w', offset: 0}
  ],
  refresh,

  policies : {
    'despText': $AG.policy.TextPolicy('Desp', location),
    'pin': pinPolicy(['0', '1','2'])
  }
};
//场景异步调用
var asyncInvoke = {
  name: 'asyncInvoke',
  desc: '场景异步调用',
  url: 'assets/image/editor/event_node_component_Async.gif',
  paletteUrl: 'assets/image/editor/palette_component_tradeAsync.gif',
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
    {id: 'W', dir: 'w', offset: 0}
  ],
  refresh,

  policies : {
    'despText': $AG.policy.TextPolicy('Desp', location),
    'pin': pinPolicy(['0', '1'])
  }
};


//并行组件
var parallelComponent = {
  name: 'parallelComponent',
  desc: '并行组件',
  url: 'assets/image/editor/Parallel_leave.gif',
  paletteUrl: 'assets/image/editor/Parallel.gif',
  type: $AG.IMAGE,
  size: [44, 160],
  canDrag: true,
  linkable: true,
  selectable: true,
  anchor: [
    {id: 'N', dir: 'n', offset: 0},
    {id: 'E', dir: 'e', offset: 0},
    {id: 'W', dir: 'w', offset: 0}
  ],
  refresh,

  policies : {
    'despText': $AG.policy.TextPolicy('Desp', location),
    'pin': pinPolicy([''])
  }
};
const stepBaseCfg = {
    id: 'stepEditor',
    children: {
        '5': stepCommonCpt,
        '3': serviceInvokdEntered,
        '7': multiOutletCpt
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        0: {
            name: '默认组件',
            items: {
                '5': stepCommonCpt,
                '3': serviceInvokdEntered,
                '7': multiOutletCpt
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
    operations
};

const nodeBaseCfg = {
    id: 'nodeEditor',
    children: {
        '2': nodeStart,
        '3': nodeEnd,
        '4': nodeAbnormalEnd,
        '14': customEnd,
        '6': nodeErrorDelegate,
        '7': componentInvoke,
        '12': tradeInvoke,
        '10': transfer,
        '11': asyncInvoke,
        '18': syncInvoke,
        '17': parallelComponent
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
              '14': customEnd,
              '6': nodeErrorDelegate,
              '7': componentInvoke,
              '12': tradeInvoke,
              '10': transfer,
              '11': asyncInvoke,
              '18': syncInvoke,
              '17': parallelComponent

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
    operations
};


export class stepConfigBuilder {

    baseCfg;

    constructor(config) {
        this.baseCfg = config || stepConfigBuilder.createConfig();
    }

    static BuildConfig(config) {
        return new stepConfigBuilder(config);
    }

    static createConfig(options) {
        return Object.assign({}, stepBaseCfg, options);
    }

    setEditorAttr(input) {
        this.baseCfg.DateInfo = input.Root.DateInfo;
        this.baseCfg.NodeMaxnimum = input.Root.NodeMaxnimum;
        this.baseCfg.uuid = input.Root.UUID;

        return this;
    }

    resolveModel(input) {
        /*{Root: {Regulation: {Step: nodes}}}*/
        let nodes;
        try {
            nodes = input.Root.Regulation.Step;
        } catch (e) {
            nodes = [];
        }

        if (nodes) {
            var nodeData = nodes instanceof Array ? nodes : [nodes];

            this.baseCfg.data = resolveEditorData(nodeData, this.baseCfg.children);
            this.baseCfg.line = resolveEditorLine(nodeData);
        }
        return this;
    }

    /*画板节点类型*/
    addNodeType(input) {
        return this;
    }

    setting(func) {
        func.call(this, this.baseCfg);

        return this;
    }

    getConfig() {
        console.log(this.baseCfg)
        return this.baseCfg;
    }
 }

 export class nodeConfigBuilder {

     baseCfg;

     constructor(config) {
         this.baseCfg = config || nodeConfigBuilder.createConfig();
     }

     static BuildConfig(config) {
         return new nodeConfigBuilder(config);
     }

     static createConfig(options) {
         return Object.assign({}, nodeBaseCfg, options);
     }

     setEditorAttr(input) {
         this.baseCfg.uuid = input.UUID;

         return this;
     }

     resolveModel({Node: nodes}) {
         if (nodes) {
             var nodeData = nodes instanceof Array ? nodes : [nodes];

             this.baseCfg.data = resolveEditorData(nodeData, this.baseCfg.children);
             this.baseCfg.line = resolveEditorLine(nodeData);
         }
         return this;
     }

     /*画板节点类型*/
     addNodeType(input) {
         return this;
     }

     setting(func) {
         func.call(this, this.baseCfg);

         return this;
     }

     getConfig() {
         return this.baseCfg;
     }
 }

 /*exm*/
/*
Events = function() {

    var listen, log, obj, one, remove, trigger, __this;

    obj = {};

    __this = this;

    listen = function (key, eventfn) {

        var stack, _ref;

        stack = ( _ref = obj[key] ) != null ? _ref : obj[key] = [];

        return stack.push(eventfn);

    };

    one = function (key, eventfn) {

        remove(key);

        return listen(key, eventfn);

    };

    remove = function (key) {

        var _ref;

        return ( _ref = obj[key] ) != null ? _ref.length = 0 : void 0;

    };

    trigger = function () {

        var fn, stack, _i, _len, _ref, key;

        key = Array.prototype.shift.call(arguments);

        stack = ( _ref = obj[key] ) != null ? _ref : obj[key] = [];

        for (_i = 0, _len = stack.length; _i < _len; _i++) {

            fn = stack[_i];

            if (fn.apply(__this, arguments) === false) {

                return false;

            }

        }
    }

        return {

            listen: listen,

            one: one,

            remove: remove,

            trigger: trigger

        }

}*/