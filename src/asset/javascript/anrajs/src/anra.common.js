import HashMap from '../lib/hashmap'
import Base from '../lib/Base'
import TAFFY from '../lib/taffy'
import * as constants from './anra.constants'

window.requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.msRequestAnimationFrame;

Base.prototype._do = function (func) {
    func.call(this);
};

//call 调用
var Util = {};
Util.isValid = function() {
    if (! this instanceof Array) {
        console.log('not array')
    }
}
Util.indexOf = function (val) {
    Util.isValid();
    
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Util.remove = function (val) {
    Util.isValid();
    
    if (typeof val == 'number') {
        var o = this[val];
        this.splice(val, 1);
        return o;
    } else {
        Util.removeObject.call(this, val);
        return val;
    }
};

Util._do = function (func) {
    Util.isValid();
    
    for (var i = 0; i < this.length; i++) {
        func.call(this[i]);
    }
};


Util.insert = function (item, index) {
    Util.isValid();
    
    this.splice(index, 0, item);
};
/**
 * 移除数组中的指定对象
 * @param val
 */
Util.removeObject = function (val) {
    Util.isValid();
    
    var index = Util.indexOf.call(this, val);
    if (index > -1) {
        Util.remove.call(this, index);
    }
};
Util.isEmpty = function () {
    Util.isValid();
    
    return this.length == 0;
};
Util.last = function () {
    Util.isValid();
    
    return this[this.length - 1];
};

Util.contains = function (obj) {
    Util.isValid();
    
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
};


/*Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    if (typeof val == 'number') {
        var o = this[val];
        this.splice(val, 1);
        return o;
    } else {
        this.removeObject(val);
        return val;
    }
};

Array.prototype._do = function (func) {
    for (var i = 0; i < this.length; i++) {
        func.call(this[i]);
    }
};


Array.prototype.insert = function (item, index) {
    this.splice(index, 0, item);
};
*
 * 移除数组中的指定对象
 * @param val
 
Array.prototype.removeObject = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.remove(index);
    }
};
Array.prototype.isEmpty = function () {
    return this.length == 0;
};
Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
};*/

function isJson(obj) {
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
}

var Map = HashMap;
Map.prototype.put = Map.prototype.set;


/*
 * common name space definition
 *
 *
 */
var anra = anra || {
        common: function () {
        },
        util: {}
    };

/**
 * 数据库
 * @type {{}}
 */
anra.Store = {
    _storeMap: {},
    newStore: function (id) {
        id || ( id = anra.genUUID());
        this._storeMap[id] = {
            node: TAFFY(),
            line: TAFFY()
        };
        return id;
    },
    get: function (id, key) {
        return key != null ? this._storeMap[id][key] : this._storeMap[id];
    }
};

/*图片加载器，用于内存管理*/
anra.ImageRegistry = Base.extend({
    images: new Map(),
    regist: function (imageURL) {
        var img = this.images.get(imageURL);
        if (img == null) {
            img = new Image();
            img.src = imageURL;
            this.images.set(imageURL, img);
        }
        return img;
    },
    isLoaded: function (imageURL) {
        var img = this.images.get(imageURL);
        if (img == null)
            img = this.regist(imageURL);
        if (img.complete)
            return true;
        return false;
    },
    get: function (imageURL) {
        return this.images.get(imageURL);
    },
    clear: function () {
        this.images.clear();
    }
});

anra.ImageRegistry = new anra.ImageRegistry();


/**
 *全局使用
 */
anra.Platform = {
    pool: new Map(),
    ready: false,
    focus: null,
    displayList: [],
    regist: function (key, object) {
        var list = this.pool.get(key);
        if (list == null) {
            list = [];
            this.pool.set(key, list);
        }
        list.push(object);
        if (!this.ready)
            this.init();
    },
    init: function () {
        //TODO 全局事件
        var p = this;
        window.addEventListener('keydown', function (event) {
            var d = p.focus;
            if (d != null && d.dispatcher != null)
                d.dispatcher.dispatchKeyDown(event);
        });

        //拦截部分快捷键，比如ctrl+s[83]，ctrl+a[65]
        document.onkeydown = function (event) {
//            console.log(event.keyCode)
            if (event.ctrlKey && (event.keyCode == 83 || event.keyCode == 65 || event.keyCode == 112 ))
                return false;
        }
        window.addEventListener('keyUp', function (event) {
            var d = p.focus;
            if (d != null && d.dispatcher != null)
                d.dispatcher.dispatchKeyUp(event);
        });
        this.ready = true;
    },
    get: function (key) {
        return this.pool.get(key);
    },
    unregist: function (key) {
        this.pool.delete(key);
    },
    getCurrentScene: function () {
        var canvas = this.get(this.DISPLAY);
        return canvas.scenes[canvas.currentScene];
    },
    getDisplay: function () {
        return this.focus == null ? this.get(this.DISPLAY)[0] : this.focus;
    },
    error: function (e) {
        this.getDisplay().error(e);
    }
};

/**
 *矩形工具类
 * @type {Object}
 */
anra.Rectangle = {
    contains: function (rect, x, y) {
        if (rect == null)
            return false;
        return (x > rect.x) && (y > rect.y) && x < (rect.x + rect.width) && y < (rect.y + rect.height);
    },
    observe: function (r1, r2) {
        return (r1.x < r2.x) && (r1.y < r2.y ) && ( r1.x + r1.width > r2.x + r2.width) && ( r1.y + r1.height > r2.y + r2.height);
    },
    distance: function (r1, r2) {
        return Math.sqrt((r1[0] - r2[0]) * (r1[0] - r2[0]) + (r1[1] - r2[1]) * (r1[1] - r2[1]));
    }
};

anra.Platform.DISPLAY = 0;
anra.Platform.PAINTER = 1;


anra._EventTable = {
    on: function (eventType, listener) {
        if (listener == null) anra.Platform.getDisplay().error("listener can not be null");
        if (this.eventTable == null) this.eventTable = new anra.event.EventTable();
        this.eventTable.hook(eventType, listener);
        if (this.afterAddListener != null) this.afterAddListener();
    },
    off: function (eventType, listener) {
        if (listener == null) anra.Platform.getDisplay().error("listener can not be null");
        if (this.eventTable == null)return;
        this.eventTable.unhook(eventType, listener);
        if (this.afterRemoveListener != null) this.afterRemoveListener();
    },
    dispose: function () {
        if (this.eventTable != null)
            this.eventTable.dispose();
    },
    notifyListeners: function (eventType, event, isGlobalEvent) {
        if (this.parent != null && !isGlobalEvent && Util.contains.call(anra.BubbleEvent, eventType)) {
            var ls = this.eventTable == null ? null : this.eventTable.getListeners(eventType);
            if (ls == null || ls.length == 0) {
                this.parent.notifyListeners(eventType, event, isGlobalEvent);
                return;
            }
        }
        if (event == null) event = new anra.event.Event();
        event.type = eventType;
        event.widget = this;
        event.display = anra.Platform.getDisplay();
        if (event.time == 0) {
            event.time = new Date().getTime();
        }
        ;
        if (isGlobalEvent) {
            anra.Platform.getDisplay().postEvent(event);
        } else {
            if (this.eventTable != null)
                this.eventTable.sendEvent(event);
        }
    }
};
/**
 * 显示器
 * @type {*}
 */
anra._Display = {
    id: "default canvas",
    element: null,
    globalListener: null,
    postEvent: function (e) {
        if (this.eventTable != null)
            this.eventTable.sendEvent(e);
    },
    notifyListeners: function () {
    },
    error: function (msg) {
//        alert(msg);
        throw msg;
    },
    p2x: function (p) {
        if (this.element == null)
            return -1;
        return this.element.width * p / 100;
    },
    p2y: function (p) {
        if (this.element == null)
            return -1;
        return this.element.height * p / 100;
    },
    getRelativeLocation: function (event) {
        var ev = event || window.event;
        var x = ev.clientX - this.getX(this.element) + Math.floor(window.pageXOffset);
        var y = ev.clientY - this.getY(this.element) + Math.floor(window.pageYOffset);

        return [x, y];
    },
    getX: function (obj) {
//        if (this.left != null)
//            return this.left - obj.scrollLeft;
        var parObj = obj;
        var left = parObj.offsetLeft;
        while (parObj = parObj.offsetParent) {
            left += parObj.offsetLeft;
        }
//        this.left = left;
        return left - obj.scrollLeft;
    },
    getY: function (obj) {
        /*在外框发生变化时，top也应该随时变化，当然，可以考虑监听外部元素的位置变化来实现*/
//        if (this.top != null)
//            return this.top - obj.scrollTop;
        var parObj = obj;
        var top = obj.offsetTop;
        while (parObj = parObj.offsetParent) {
            top += parObj.offsetTop;
        }
//        this.top = top;
        /*scrollTop是为了考虑滚动条位置*/
        return top - obj.scrollTop;
    }
};
anra.Display = Base.extend(anra._Display).extend(anra._EventTable)
;

/**
 * 控件
 * @type {*}
 */
anra.Widget = Base.extend({
    id: "",
    image: null,
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    paint: function () {
    },
    error: function (msg) {
        this.display.error(this.id + ":" + msg);
    }
}).extend(anra._EventTable);
anra.Control = anra.Widget.extend({
    parent: null,
    constructor: function () {
        this._init();
    },
    _init: function () {
        if (this.init != null) this.init();
    },
    addMouseListener: function (listener) {
        if (listener == null) this.error("NullPointException anra.Control#addMouseListener");
        this.on(anra.EVENT.MouseDown, listener);
        this.on(anra.EVENT.MouseUp, listener);
        this.on(anra.EVENT.MouseDoubleClick, listener);
    },
    addKeyListener: function (listener) {
        if (listener == null) this.error("NullPointException anra.Control#addKeyListener");
        this.on(anra.EVENT.KeyDown, listener);
        this.on(anra.EVENT.KeyUp, listener);
    },
    addTouchListener: function (listener) {
        if (listener == null) this.error("NullPointException anra.Control#addTouchListener");
        this.on(anra.EVENT.TouchStart, listener);
        this.on(anra.EVENT.TouchMove, listener);
        this.on(anra.EVENT.TouchEnd, listener);
    },
    selected: function (s) {
    }
});
anra.Composite = anra.Control.extend({
    selection: null,
    /*找到指定位置的控件*/
    findWidgetOnXY: function (x, y) {
    },
    setSelection: function (o) {
        if (this.selection != null)
            this.selection.setSelected(false);
        this.selection = o;
        this.selection.setSelected(true);
    }
});


/**
 * 监听
 * @type {*|void}
 */
anra.Listener = Base.extend({
    func: null,
    constructor: function (func) {
        this.func = func;
    },
    handleEvent: function (event) {
        if (this.func != null)
            this.func(event);
    }
});
anra.KeyListener = anra.Listener.extend({
    handleEvent: function (event) {
        if (event.type == anra.EVENT.KeyDown) {
            this.handleKeyDownEvent(event);
        } else if (event.type == anra.EVENT.KeyUp) {
            this.handleKeyDownUp(event);
        }
    },
    handleKeyDownEvent: function (event) {
    }, handleKeyDownUp: function (event) {
    }
});

/**
 * 动作
 * @type {*|Object}
 */
anra.Action = Base.extend({
    id: "", run: function () {
    }
});

anra.Menu = Base.extend({
    show: function () {
        if (this.widget == null) {
            this.widget = this.create();
        }
    },
    create: function () {

    },
    update: function () {

    },
    hide: function () {

    }
});

/**
 *事件定义
 */
anra.event = anra.event || {};
anra.EVENT = {
    NONE: 0,
    MouseDown: 'mousedown',
    MouseUp: 'mouseup',
    MouseOver: 'mouseover',
    MouseIn: 'mousein',
    MouseOut: 'mouseout',
    MouseClick: 'click',
    MouseDoubleClick: 'dblclick',
    MouseDrag: 'drag',
    MouseMove: 'mousemove',
    KeyDown: 'keydown',
    KeyUp: 'keyup',
    TouchStart: 'touchstart',
    TouchMove: 'touchmove',
    TouchEnd: 'touchend',
    DragStart: 'dragstart',
    DragEnd: 'dragend',
    Dropped: 'dropped',
    ContextMenu: 'contextmenu'
};
var E = anra.EVENT;
/**
 *以下事件，如果当前元素没有监听，则冒泡到父级
 * @type {Array}
 */
anra.BubbleEvent = [
    E.MouseDown, E.MouseUp, E.MouseMove, E.MouseDoubleClick, E.MouseDrag, E.DragEnd, E.DragStart
];

anra.event.Event = Base.extend({
    widget: null,
    type: 0,
    x: undefined,
    y: undefined,
    prop: null,
    constructor: function (obj, location, prop) {
        this.type = obj || anra.EVENT.NONE;
        if (location != null && location.length == 2) {
            this.x = location[0];
            this.y = location[1];
        }
        this.prop = prop;
    }
});

anra.event.KeyEvent = anra.event.Event.extend({
    key: undefined,
    keyCode: undefined,
    constructor: function (obj, location, event) {
        if (event != null) {
            //            this.keyCode = event.keyCode;
            for (var k in event) {
                this[k] = event[k];
            }
        }
        this.type = obj || anra.EVENT.NONE;
        if (location != null && location.length == 2) {
            this.x = location[0];
            this.y = location[1];
        }
    }
});
anra.event.TouchEvent = anra.event.Event.extend({
    touches: [],
    constructor: function (obj, location, event) {
        this.type = obj || anra.EVENT.NONE;
        if (location != null && location.length == 2) {
            this.x = location[0];
            this.y = location[1];
        }
        if (event != null) {
            this.touches = event.touches;
        }
    }
});
anra.event.EventTable = Base.extend({
    types: null,
    listeners: null,
    level: 0,
    constructor: function () {
        this.types = [];
        this.listeners = [];
    },
    containsEvent: function (eventType) {

    },
    getListeners: function (eventType) {
        var result = [];
        for (var i = 0; i < this.types.length; i++) {
            if (this.types [i] == eventType) {
                result.push(this.listeners [i]);
            }
        }
        return result;
    },
    hook: function (eventType, listener) {
        this.types.push(eventType);
        this.listeners.push(listener);
    },
    unhook: function (eventType, listener) {
        for (var i = 0; i < this.types.length; i++) {
            if (this.types[i] == eventType && this.listeners[i] == listener) {
                this.remove(i);
                return;
            }
        }
    },
    dispose: function () {
        this.types.length = 0;
        this.listeners.length = 0;
    },
    remove: function (i) {
        Util.remove.call(this.types, i);
        Util.remove.call(this.listeners, i);
    },
    sendEvent: function (event) {
        if (event.type == anra.EVENT.NONE)return;
        for (var i = 0; i < this.types.length; i++) {
            if (this.types[i] == event.type) {
                var l = this.listeners[i];
                if (l != null)
                    if (typeof(l) == 'function') {
                        l(event);
                    } else
                        l.handleEvent(event);
            }
        }
    },
    size: function () {
        return this.types.length;
    }
});
/**
 * 命令
 * @type {*}
 */
anra.Command = Base.extend({

    execute: function () {
    },
    canExecute: function () {
        return true;
    },
    redo: function () {
        this.execute();
    },
    undo: function () {
    },
    canUndo: function () {
        return true;
    },
    dispose: function () {
    },
    chain: function (command) {
        if (command == null)
            return this;

        var result = new anra.ChainedCompoundCommand();
        result.add(this);
        result.add(command);
        return result;
    }
});
anra.ChainedCompoundCommand = anra.Command.extend({
    commandList: null,
    constructor: function () {
        this.commandList = [];
    },
    add: function (c) {
        if (c != null) this.commandList.push(c);
    },
    canExecute: function () {
        if (this.commandList.length == 0)
            return false;
        for (var i = 0, len = this.commandList.length; i < len; i++) {
            var cmd = this.commandList[i];
            if (cmd == null)
                return false;
            if (!cmd.canExecute())
                return false;
        }
        return true;
    },
    canUndo: function () {
        if (this.commandList.length == 0)
            return false;
        for (var i = 0, len = this.commandList.length; i < len; i++) {
            var cmd = this.commandList[i];
            if (cmd == null)
                return false;
            if (!cmd.canUndo())
                return false;
        }
        return true;
    },
    dispose: function () {
        for (var i = 0, len = this.commandList.length; i < len; i++) {
            this.commandList[i].dispose();
        }
    },
    execute: function () {
        for (var i = 0, len = this.commandList.length; i < len; i++) {
            this.commandList[i].execute();
        }
    },
    undo: function () {
        for (var i = this.commandList.length - 1; i >= 0; i--)
            this.commandList[i].undo();
    },
    getCommands: function () {
        return this.commandList;
    },
    isEmpty: function () {
        return this.commandList == null || this.commandList.length == 0;
    },
    size: function () {
        return this.commandList.length;
    },
    chain: function (c) {
        if (c != null)
            this.add(c);
        return this;
    }
});
/**
 * 命令事件
 * @type {*}
 */
anra.CommandEvent = Base.extend({
    statck: null,
    command: null,
    state: null,
    constructor: function (stack, cmd, state) {
        this.stack = stack;
        this.command = cmd;
        this.state = state;
    }
});
/**
 * 动作注册器
 * @type {*}
 */
anra.ActionRegistry = Base.extend({
    constructor: function (host) {
        this.selectionActions = new Map();
        this.cmdStackActions = new Map();
        this.propertyActions = new Map();
        this.handles = new Map();
        this.host = host;
    },
    keyHandle: function (e) {
        var keys = [];
        if (e.altKey)
            keys.push('alt');
        if (e.ctrlKey)
            keys.push('ctrl');
        if (e.shiftKey)
            keys.push('shift');
//        keys.push(this.getKeyString(e.keyCode, e.code));
        keys.push(e.key.toLowerCase());

        return this.handles.get(keys.sort().join('+'));
    },
    regist: function (action) {
        if (action instanceof Array) {
            for (var i = 0; i < action.length; i++) {
                this.registAction(action[i]);
            }
        } else {
            this.registAction(action);
        }
        return this;
    },
    registAction: function (action) {
        if (action.id == null) {
            console.log('action id can not be null');
            return;
        }

        switch (action.type) {
            case constants.ACTION_SELECTION:
                this.selectionActions.put(action.id, action);
                break;
            case constants.ACTION_STACK:
                this.cmdStackActions.put(action.id, action);
                break;
            case constants.ACTION_EDITOR:
                this.propertyActions.put(action.id, action);
                break;
        }
        action.host = this.host;
        this.registKeyHandler(action);
    },
    registKeyHandler: function (action) {
        var key = action.key;
        if (key == null)return;
        this.handles.put(key.toLowerCase().split('+').sort().join('+'), action);
    }

});

/**
 * 命令栈
 * @type {*}
 */
anra.CommandStack = Base.extend({
    redoable: null,
    undoable: null,
    listeners: null,
    saveLocation: 0,
    constructor: function () {
        this.redoable = [];
        this.undoable = [];
        this.listeners = [];
    },
    addCommandStackEventListener: function (e) {
        if (e instanceof anra.Listener)
            this.listeners.push(e);
    },
    canRedo: function () {
        return this.redoable.length > 0;
    },
    canUndo: function () {
        return this.undoable.length == 0 ? false : this.undoable[this.undoable.length - 1].canUndo();
    },
    redo: function () {
        if (!this.canRedo())
            return;
        var command = this.redoable.pop();
        this.notifyListeners(command, constants.PRE_REDO);
        command.redo();
        this.undoable.push(command);
        this.notifyListeners();
    },
    undo: function () {
        if (!this.canUndo())return;
        var command = this.undoable.pop();
        this.notifyListeners(command, constants.PRE_UNDO);
        command.undo();
        this.redoable.push(command);
        this.notifyListeners();
    }, notifyListeners: function (command, state) {
        for (var i = 0; i < this.listeners.length; i++)
            this.listeners[i].handleEvent(event);
    },
    flush: function () {
        this.flushRedo();
        this.flushUndo();
        this.saveLocation = 0;
        this.notifyListeners();
    },
    flushRedo: function () {
        while (!Util.isEmpty.call(this.redoable))
            this.redoable.pop().dispose();
    },
    flushUndo: function () {
        while (!Util.isEmpty.call(this.undoable))
            this.undoable.pop().dispose();
    },
    execute: function (c) {
        if (c == null || !c.canExecute())
            return;
        this.flushRedo();
        this.notifyListeners(c, constants.PRE_EXECUTE);
        try {
            c.execute();
            if (this.getUndoLimit() > 0)
                while (this.undoable.length > this.getUndoLimit()) {
                    Util.remove.call(this.undoable, 0);
                    if (this.saveLocation > -1)
                        this.saveLocation--;
                }
            if (this.saveLocation > this.undoable.length)
                this.saveLocation = -1;
            this.undoable.push(c);
        } finally {
            this.notifyListeners(c, constants.POST_EXECUTE);
        }
    },
    getUndoLimit: function () {
        return 15;
    },
    markSaveLocation: function () {
        this.saveLocation = this.undoable.length;
    },
    isDirty: function () {
        return this.undoable.length != this.saveLocation;
    }
})
;

anra.PropertyListenerSupport = Base.extend({
    constructor: function () {
        this.map = new anra.ArrayMap();
    },
    addPropertyListener: function (listener, key) {
        if (listener == null)return;
        this.map.put(key != null ? key : listener.key != null ? listener.key : null, listener);
    },
    removePropertyListener: function (listener, key) {
        if (listener == null)return;
        this.map.remove(key != null ? key : listener.key != null ? listener.key : null, listener);
    },
    firePropertyChanged: function (key, oldValue, newValue) {
        var named = this.map.getListeners(key);
        this.fire(named, key, oldValue, newValue);
        if (key != null) {
            var common = this.map.getListeners(null);
            this.fire(common, key, oldValue, newValue);
        }
    },
    fire: function (ls, key, oldValue, newValue) {
        if (ls != null)
            for (var i = 0, len = ls.length; i < len; i++) {
                if (typeof ls[i] == 'function')
                    ls[i](key, oldValue, newValue);
                else if (ls[i].propertyChanged != null)
                    ls[i].propertyChanged(key, oldValue, newValue);
            }
    }
});

anra.ArrayMap = Base.extend({
    map: null,
    constructor: function () {
        this.map = new HashMap();
    },
    put: function (k, v) {
        if (v == null)return;
        var vs = this.map.get(k);
        if (vs == null) {
            vs = [];
            this.map.put(k, vs);
        }
        vs.push(v);
    },
    getListeners: function (key) {
        return this.map.get(key);
    },
    remove: function (k, v) {
        if (v == null)return;
        var vs = this.map.get(k);
        if (vs == null)
            return;
        Util.removeObject.call(vs, v);
    }
});

anra.genUUID = function () {
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
};
``

export {Map, Array, anra, Util};