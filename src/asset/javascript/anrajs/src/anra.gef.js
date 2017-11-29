/**
 * GEF(graphic editor framework)相关类，参考Eclipse GEF编写，完全应用MVC模式。
 * @type {Object}
 */
import {Map, Util} from './anra.common'
import Base from '../lib/Base'
import {anra} from './anra.svg'
import * as constants from './anra.constants'

anra.gef = {};

/**
 * 视图
 * @type {*}
 */
anra.gef.Figure = anra.svg.Composite.extend({
    class: 'Figure',
    isSelected: constants.SELECTED_NONE,
    repaintListeners: null,
    init: function () {
    },
    cal: function (id) {
        if (this.anchorMap == null)return null;
        var a = this.anchorMap.get(id);
        if (a != null) {
            a = this.calAnchor(a.dir, a.offset);
            a.id = id;
            return a;
        }
        return null;
    },
    registAnchor: function (anchor) {
        if (this.anchorMap == null)
            this.anchorMap = new Map();
        this.anchorMap.put(anchor.id, anchor);
        return this;
    },
    registAnchors: function (anchors) {
        if (anchors instanceof Array) {
            for (var i = 0; i < anchors.length; i++) {
                this.registAnchor(anchors[i]);
            }
        }
    },
    getSourceAnchorByTerminal: function (id) {
        return this.cal(id);
    },
    getTargetAnchorByTerminal: function (id) {
        return this.cal(id);
    },
    getAnchors: function () {
        return this.anchorMap ? this.anchorMap.values().map((item) => ({...item, ...this.cal(item.id)})) : [];
    },
    getSourceAnchor: function (req) {
        //TODO 现在每次都计算anchor，考虑优化为figure bounds改变后再计算
        var x = req.event.x;
        var y = req.event.y;
        return this.findClosestAnchor(x, y);
    },
    getTargetAnchor: function (req) {
        var x = req.event.x;
        var y = req.event.y;
        return this.findClosestAnchor(x, y);
    },
    findClosestAnchor: function (x, y) {
        var anchors = this.getAnchors();
        var closest, min, b;
        for (var i = 0; i < anchors.length; i++) {
            b = Math.abs(anchors[i].x - x) + Math.abs(anchors[i].y - y);
            if (closest == null || min > b) {
                closest = anchors[i];
                min = b;
            }
        }
        return closest;
    },
    calAnchor: function (dir, offset) {
        if (offset == null) offset = 0;
        var b = this.bounds;
        switch (dir) {
            case anra.EAST:
                return {x: b['x'] + b['width'], y: b['y'] + b['height'] / 2 + offset};
            case anra.SOUTH:
                return {x: b['x'] + b['width'] / 2 + offset, y: b['y'] + b['height']};
            case anra.WEST:
                return {x: b['x'], y: b['y'] + b['height'] / 2 + offset};
            case anra.NORTH:
                return {x: b['x'] + b['width'] / 2 + offset, y: b['y']};
            case anra.CENTER:
                return {x: b['x'] + b['width'] / 2, y: b['y'] + b['height'] / 2};
        }
    },
    propertyChanged: function (key, ov, nv) {
    },
    selectionChanged: function (value) {
        switch (value) {
            case constants.SELECTED_NONE:
                this.owner.style.cursor = 'default';
                break;
            case constants.SELECTED_PRIMARY:
            case constants.SELECTED:
                this.owner.style.cursor = 'move';
        }

    },
    setModel: function (m) {
        this.unlisten();
        this.model = m;
        this.listen();
    },
    listen: function () {
        if (this.model instanceof anra.gef.BaseModel) {
            this.model.addPropertyListener(this);
        }
    },
    unlisten: function () {
        if (this.model instanceof anra.gef.BaseModel) {
            this.model.removePropertyListener(this);
        }
    },
    paint: function () {
        this.applyBounds();
        /*if (this.layoutManager != null)
         this.layout();*/
        this.fireRepaintListener();
        if (this.children)
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].paint();
            }

        if (this.layoutManager != null)
            this.layout();
    },
    fireRepaintListener: function () {
        if (this.repaintListeners != null) {
            this.repaintListeners.forEach(function (_f, _k) {
                _k(this);
            }, this);
        }
    },
    addRepaintListener: function (listener) {
        if (this.repaintListeners == null)
            this.repaintListeners = new Map();
        this.repaintListeners.put(listener, null);
    },
    removeRepaintListener: function (listener) {
        if (this.repaintListeners != null)
            this.repaintListeners.remove(listener);
    },
    dispose: function () {
        anra.svg.Composite.prototype.dispose.call(this);
        this.unlisten();
        if (this.repaintListeners != null) {
            this.repaintListeners.clear();
            this.repaintListeners = null;
        }
    }
});
anra.gef.Figure.init = function (config) {
    if (config.type == null)
        throw 'figure config need a type like anra.svg.Circle';
    var f;
    if (typeof(config.type) == 'function')
        f = config.type;
    else
        f = anra.gef.Figure.extend(config.type);
    f = new f();
    f.applyConfig && f.applyConfig(config);
    return f;
};
var FLAG_ACTIVE = 1;
var FLAG_FOCUS = 2;
var MAX_FLAG = FLAG_FOCUS;

/**
 * 控制器
 * @type {*}
 */
anra.gef.EditPart = Base.extend({
    class: 'EditPart',
    selectable: true,
    model: null,
    parent: null,
    selected: constants.SELECTED_NONE,
    figure: null,
    policies: null,
    children: null,
    flags: 0,
    editor: null,
    eventTable: null,
    constructor: function () {
        this.sConns = [];
        this.tConns = [];
        this.children = [];
        this.policies = new Map();
        this.eventTable = new anra.event.EventTable();
    },
    $on: function (k, f) {
        if (this.__adapters == null) {
            this.__adapters = {}
        }
        this.__adapters[k] = f;
    },
    $emit: function (k, p, callback) {
        if (this.__adapters && this.__adapters[k]) {
            this.__adapters[k].call(this, p, callback);
        }
    },
    setLayout: function (layout) {
        this.getLayer(anra.gef.RootEditPart.PrimaryLayer).layoutManager = layout;
        this.getLayer(anra.gef.RootEditPart.PrimaryLayer).paint();
    },
    getRoot: function () {
        return this;
    },
    refreshChildren: function () {
        var i;
        if (this.children != null) {
            var map = new Map();
            //增量修改当前children
            for (i = 0; i < this.children.length; i++)
                map.set(this.children[i].model, this.children[i]);
            var model, editPart;
            var modelChildren = this.getModelChildren();
            for (i = 0; i < modelChildren.length; i++) {
                model = modelChildren[i];
                if (i < this.children.length
                    && this.children[i].model.equals(model)) {
                    continue;
                }
                editPart = map.get(model);
                if (editPart != null)
                    this.reorderChild(editPart, i);
                else {
                    editPart = this.createChild(model);
                    this.addChild(editPart, i);
                }
            }

            var size = this.children.length;
            if (i < size) {
                var trash = [];
                for (; i < size; i++)
                    trash.push(this.children[i]);
                for (i = 0; i < trash.length; i++) {
                    var ep = trash[i];
                    this.removeChild(ep);
                }
            }
        }
    },
    removeChild: function (child) {
        if (child == null)
            throw 'child can not be null';
        var index = Util.indexOf.call(this.children, child);
        if (index < 0)
            return;
        this.fireRemovingChild(child, index);
        if (this.isActive())
            child.deactivate();
        child.removeNotify();
        this.removeChildVisual(child);
        child.setParent(null);
        Util.remove.call(this.children, child);
    },
    fireRemovingChild: function (child, index) {
        var listeners = this.eventTable.getListeners(anra.gef.EditPartListener.prototype.class);
        for (var i = 0, len = listeners.length; i < len; i++) {
            listeners[i].removingChild(child, index);
        }
    },
    createChild: function (model) {
        if (this.editor == null) {
            anra.Platform.error("EditPart的editor不能为空");
            return null;
        }
        var part = this.editor.createEditPart != null ? this.editor.createEditPart(this, model) : model.editPartClass != null ? new model.editPartClass : null;
        if (part == null)
            return null;
        part.model = model;
        part.editor = this.editor;
        return part;
    },
    addChild: function (child, index) {
        if (this.children == null)
            this.children = [];
        if (index == null)
            index = this.children.length;

        Util.insert.call(this.children, child, index);
        child.setParent(this);
        this.addChildVisual(child, index);
        child.addNotify();
        child.activate();
        this.fireChildAdded(child, index);
    },
    fireChildAdded: function (child, index) {
        var listeners = this.eventTable.getListeners(anra.gef.EditPartListener.prototype.class);
        for (var i = 0, len = listeners.length; i < len; i++)
            listeners[i].childAdded(child, index);
    },
    reorderChild: function (editpart, index) {
//        this.removeChildVisual(editpart);
        Util.removeObject.call(this.children, editpart);
        Util.insert.call(this.children, editpart, index);
//        this.addChildVisual(editpart, index);
    },
    removeChildVisual: function (child) {
        this.getFigure().removeChild(child.getFigure());
    },
    addChildVisual: function (child, index) {
        this.getFigure().addChild(child.getFigure());
    },
    deactivate: function () {
        var i;
        for (i = 0; i < this.children.length; i++) {
            this.children[i].deactivate();
        }
        for (i = 0; i < this.sConns.length; i++) {
            this.sConns[i].deactivate();
        }
        this.deactivePolicies();
        this.setFlag(FLAG_ACTIVE, false);
    },
    activate: function () {
        this.setFlag(FLAG_ACTIVE, true);
        this.doActive();
        this._initFigureListeners();

        this.activePolicies();
        var i;
        for (i = 0; i < this.children.length; i++)
            this.children[i].activate();

        this.fireActivated();

        for (i = 0; i < this.sConns.length; i++) {
            this.sConns[i].activate();
        }
    },
    doActive: function () {
    },
    fireActivated: function () {
        var listeners = this.eventTable.getListeners(anra.gef.EditPartListener.prototype.class);
        for (var i = 0, len = listeners.length; i < len; i++)
            listeners[i].partActivated(this);
    },
    getFigure: function () {
        if (this.figure == null) {
            this.figure = this.createFigure(this.model);
            this.figure.setModel(this.model);
        }
        return this.figure;
    },
    _initFigureListeners: function () {
        if (this.figure != null) {
            var _dt = this.getRoot().editor.getTopDragTracker();
            var _ep = this;
            this.figure.on(anra.EVENT.MouseDown, function (e) {
                _dt.mouseDown(e, _ep);
            });
            this.figure.on(anra.EVENT.MouseIn, function (e) {
                _dt.mouseIn(e, _ep);
            });
            this.figure.on(anra.EVENT.MouseOut, function (e) {
                _dt.mouseOut(e, _ep);
            });
            this.figure.on(anra.EVENT.MouseClick, function (e) {
                _dt.mouseClick(e, _ep);
            });
            this.figure.on(anra.EVENT.DragStart, function (e) {
                _dt.dragStart(e, _ep);
            });
            this.figure.on(anra.EVENT.DragEnd, function (e) {
                _dt.dragEnd(e, _ep);
            });
            this.figure.on(anra.EVENT.MouseDrag, function (e) {
                _dt.mouseDrag(e, _ep);
            });
            this.figure.on(anra.EVENT.MouseMove, function (e) {
                _dt.mouseMove(e, _ep);
            });
            this.figure.on(anra.EVENT.MouseUp, function (e) {
                _dt.mouseUp(e, _ep);
            });
        }
    },
    createFigure: function (model) {
        var f;
        if (this.config && this.config.createFigure)
            f = this.config.createFigure.call(this, model);
        else if (this.config.type)
            f = anra.gef.Figure.init(this.config);
        if (f == null)
            throw ': EditPart of ' + model.props.id + ' should has a figure config or createFigure function';
        if (this.config.style)
            f.setStyle(this.config.style);
        if (this.config.attr)
            f.setAttribute(this.config.attr);
        if (this.config.anchor)
            f.registAnchors(this.config.anchor);
        this.onCreateFigure && this.onCreateFigure(f);
        return f;
    },
    isActive: function () {
        return this.getFlag(FLAG_ACTIVE);
    },
    getFlag: function (flag) {
        return (this.flags & flag) != 0;
    },
    setFlag: function (f, v) {
        if (v)
            this.flags |= f;
        else
            this.flags &= ~f;
    },
    addEditPartListener: function (listener) {
        this.eventTable.hook(listener.class, listener);
    },
    addNotify: function () {
        this.register();
        this.createEditPolicies();
        for (var i = 0; i < this.children.length; i++)
            this.children[i].addNotify();
        this.refresh();
    },
    createEditPolicies: function () {
        var key, p;
        if (this.config && this.config.policies) {
            for (key in this.config.policies) {
                p = this.config.policies[key];
                if (p instanceof anra.gef.Policy)
                    this.installEditPolicy(key, p);
                else {
                    this.installEditPolicy(key, anra.gef.Policy.init(p));
                }
            }
        }
    },
    installPolicies: function (policies) {
        for (var k in policies) {
            this.installEditPolicy(k, anra.gef.Policy.init(policies[k]));
        }
    },
    installEditPolicy: function (key, editPolicy) {
        if (key == null) {
            throw 'installEditPolicy:Edit Policies must be installed with key';
        }
        if (editPolicy == null || !(editPolicy instanceof anra.gef.Policy)) {
            throw 'installEditPolicy:Edit Policies must be instanceof of anra.gef.Policy';
        }
        if (this.policies == null) {
            this.policies = new Map();
            this.policies.set(key, editPolicy);
        }
        else {
            var oldEditPolicy = this.policies.get(key);
            if (oldEditPolicy != null && oldEditPolicy.isActive()) {
                oldEditPolicy.deactivate();
            }
            this.policies.set(key, editPolicy);
        }
        editPolicy.setHost(this);
        if (this.isActive()) {
            editPolicy.activate();
        }
    },
    activePolicies: function () {
        this.policies.forEach(function (editPolicy) {
            editPolicy.activate();
        });
    },
    deactivePolicies: function () {
        this.policies.forEach(function (editPolicy) {
            editPolicy.deactivate();
        });
    },
    validatePolicies: function () {
        this.policies.forEach(function (editPolicy) {
            editPolicy.validatePolicy();
        });
    },
    getEditPolicy: function (key) {
        var policy = this.policies.get(key);
        return policy;
    },
    getLayoutPolicy: function () {
        return this.policies.get(anra.gef.LAYOUT_POLICY);
    },
    getConnectionPolicy: function () {
        return this.policies.get(anra.gef.CONNECTION_POLICY);
    },
    installLayoutPolicy: function (p) {
        this.installEditPolicy(anra.gef.LAYOUT_POLICY, p);
    },
    removeEditPolicy: function (key) {
        this.policies.remove(key);
    },
    unregister: function () {
        this.unregisterAccessable();
        this.unregisterVisuals();
//        this.deactivate();
    },
    register: function () {
        this.registerAccessable();
        this.registerVisuals();
    },
    registerAccessable: function () {
        this.getRoot().regist(this);
    },
    unregisterAccessable: function () {
        this.getRoot().unregist(this);
    },
    registerVisuals: function () {
    },
    unregisterVisuals: function () {
    },
    eraseSourceFeedback: function (request) {
        if (!this.isActive())
            return;
        if (this.policies != null) {
            this.policies.forEach(function (v, k) {
                v.eraseSourceFeedback(request);
            });
        }
    },
    eraseTargetFeedback: function (request) {
        if (!this.isActive())
            return;
        if (this.policies != null) {
            this.policies.forEach(function (v, k) {
                v.eraseTargetFeedback(request);
            });
        }
    },
    showSourceFeedback: function (request) {
        if (!this.isActive())
            return;
        if (this.policies != null) {
            this.policies.forEach(function (v, k) {
                v.showSourceFeedback(request);
            });
        }
    },
    showTargetFeedback: function (request) {
        if (!this.isActive())
            return;
        if (this.policies != null) {
            this.policies.forEach(function (v, k) {
                v.showTargetFeedback(request);
            });
        }
    },
    getCommand: function (request) {
        var command = null;
        if (this.policies != null) {
            var plist = this.policies.values();
            for (var i = 0, len = plist.length; i < len; i++) {
                if (command != null)
                    command = command.chain(plist[i].getCommand(request));
                else
                    command = plist[i].getCommand(request);
            }
        }
        return command;
    },
    getDragTracker: function (request) {
        if (this.dragTracker == null && this.createDragTracker != null) {
            this.dragTracker = this.createDragTracker(request);
        }
        return this.dragTracker;
    },
    getSelected: function () {
        return this.selected;
    },
    getTargetEditPart: function (request) {
        var editPart;
        var plist = this.policies.values();
        for (var i = 0, len = plist.length; i < len; i++) {
            if (plist[i].getTargetEditPart != null)
                editPart = plist[i].getTargetEditPart(request);
            if (editPart != null)
                return editPart;
        }
        if (constants.REQ_SELECTION == request.type) {
            if (this.isSelectable())
                return this;
        }
        return null;
    },
    isSelectable: function () {
        return false;
    },
    getScene: function () {
    },
    hasFocus: function () {
        return this.getFlag(FLAG_FOCUS);
    },
    performRequest: function (request) {
        if (!this.isActive())
            return;
        if (this.policies != null) {
            this.policies.forEach(function (v, k) {
                v.performRequest(request);
            });
        }
    },
    refresh: function () {
        this.refreshVisual();
        this.refreshChildren();
        this.validatePolicies();
    },
    /**
     * 调用之后必须应用this.figure.paint();
     */
    refreshVisual: function () {
        if (this.figure != null) {
            this.figure.paint();
        }

    },
    removeEditPartListener: function (listener) {
        this.eventTable.unhook(listener.class, listener);
    },
    removeNotify: function () {
        this.unregisterAccessable();
        this.unregisterVisuals();
        this.unregister();
    },
    setFocus: function (f) {
        if (this.hasFocus() == f)
            return;
        this.setFlag(FLAG_FOCUS, f);
        this.fireSelectionChanged();
    },
    fireSelectionChanged: function () {
        var listeners = this.eventTable.getListeners(anra.gef.EditPartListener.prototype.class);
        for (var i = 0, len = listeners.length; i < len; i++) {
            listeners[i].selectedStateChanged(this);
        }
    },
    setModel: function (model) {
        this.model = model;
    },
    getModelChildren: function () {
        if (this.model instanceof anra.gef.NodeModel) {
            return this.model.getAllChildren();
        }
        return [];
    },
    setParent: function (parent) {
        this.parent = parent;
    },
    setSelected: function (value) {
        this.selected = value;
        if (this.figure != null && this.figure.selectionChanged != null)
            this.figure.selectionChanged(value);
        this.fireSelectionChanged();
    },
    understandsRequest: function (req) {
        if (this.policies != null) {
            var list = this.policies.values();
            for (var i = 0; i < list.length; i++) {
                if (list[i].understandsRequest != null && list[i].understandsRequest(req))return true;
            }
        }
        return false;
    }
});

anra.gef.NodeEditPart = anra.gef.EditPart.extend({
    sConns: null,
    tConns: null,
    getSourceAnchor: function (req) {
        return this.figure.getSourceAnchor(req);
    },
    getAllSourceAnchors: function () {

    },
    createDragTracker: function () {
        return null;
    },
    getTargetAnchor: function (req) {
        return this.figure.getTargetAnchor(req);
    },
    getAnchors: function () {
        return this.figure.getAnchors();
    },
    // getTargetTerminal: function (id) {
    //     return this.figure.getTargetTerminal(id);
    // },
    // getSourceTerminal: function (id) {
    //     return this.figure.getSourceTerminal(id);
    // },
    getSourceAnchorByTerminal: function (id) {
        return this.figure.getSourceAnchorByTerminal(id);
    },
    getTargetAnchorByTerminal: function (id) {
        return this.figure.getTargetAnchorByTerminal(id);
    },
    constructor: function () {
        anra.gef.EditPart.prototype.constructor.call(this);
        this.sConns = [];
        this.tConns = [];
    },
    refresh: function () {
        this.base();
        this.refreshSourceConnections();
        this.refreshTargetConnections();
    },
    getModelSourceLines: function () {
        return this.model.sourceLines == null ? [] : this.model.sourceLines.values();
    },
    getModelTargetLines: function () {
        return this.model.targetLines == null ? [] : this.model.targetLines.values();
    },
    getRoot: function () {
        return this.parent.getRoot();
    },
    refreshSourceConnections: function () {
        var i;
        var editPart;
        var model;
        var map = new Map();
        if (this.sConns.length > 0) {
            for (i = 0; i < this.sConns.length; i++) {
                editPart = this.sConns[i];
                map.set(editPart.model, editPart);
            }
        }
        var modelObjects = this.getModelSourceLines();
//        console.log('before: ',this.model.get('name'), this.sConns.length, modelObjects.length);
        for (i = 0; i < modelObjects.length; i++) {
            model = modelObjects[i];
            if (i < this.sConns.length && this.sConns[i].model == model) {
                this.sConns[i].refresh();
                continue;
            }
            editPart = map.get(model);
            if (editPart != null)
                this.reorderSourceConnection(editPart, i);
            else {
                editPart = this.createOrFindConnection(model);
                this.addSourceConnection(editPart, i);
            }
        }

        // Remove the remaining EditParts
        var size = this.sConns.length;
        if (i < size) {
            var trash = [];
            for (; i < size; i++)
                trash.push(this.sConns[i]);
            for (i = 0; i < trash.length; i++) {
                this.removeSourceConnection(trash[i]);
            }
        }
//        console.log('after: ',this.model.get('name'), this.sConns.length, modelObjects.length);

    },
    reorderSourceConnection: function (line, index) {
        var o = Util.remove.call(this.sConns, index);
        Util.insert.call(this.sConns, o, index + 1);
        line.refresh();
    },
    removeSourceConnection: function (line) {
        this.fireRemovingSourceConnection(line, Util.indexOf.call(this.sConns, line));
        if (line.source == this) {
            line.deactivate();
            line.source = null;
        }
        Util.removeObject.call(this.sConns, line);
    },
    addSourceConnection: function (line, index) {
        Util.insert.call(this.sConns, line, index);
        var source = line.source;
        if (source != null && source != this)
            Util.removeObject.call(source.sConns, line)
        line.setSource(this);
        if (this.isActive())
            line.activate();
        this.fireSourceConnectionAdded(line, index);
    },

    refreshTargetConnections: function () {
        var i;
        var editPart;
        var model;
        var map = new Map();
        if (this.tConns.length > 0) {
            for (i = 0; i < this.tConns.length; i++) {
                editPart = this.tConns[i];
                map.set(editPart.model, editPart);
            }
        }
        var modelObjects = this.getModelTargetLines();
        if (modelObjects != null)
            for (i = 0; i < modelObjects.length; i++) {
                model = modelObjects[i];
                if (i < this.tConns.length && this.tConns[i].model == model) {
                    this.tConns[i].refresh();
                    continue;
                }
                editPart = map.get(model);
                if (editPart != null)
                    this.reorderTargetConnection(editPart, i);
                else {
                    editPart = this.createOrFindConnection(model);
                    this.addTargetConnection(editPart, i);
                }
            }
        // Remove the remaining EditParts
        var size = this.tConns.length;
        if (i < size) {
            var trash = [];
            for (; i < size; i++)
                trash.push(this.tConns[i]);
            for (i = 0; i < trash.length; i++)
                this.removeTargetConnection(trash[i]);
        }
    },
    addTargetConnection: function (line, index) {
        Util.insert.call(this.tConns, line, index);
        var target = line.source;
        if (target != null && target != this)
            Util.removeObject.call(target.tConns, line);
        line.setTarget(this);
        this.fireTargetConnectionAdded(line, index);
        line.refresh();
    },
    reorderTargetConnection: function (line, index) {
        var o = Util.remove.call(this.tConns, index);
        Util.insert.call(this.tConns, o, index + 1);
        line.refresh();
    },
    removeTargetConnection: function (line, index) {
        this.fireRemovingTargetConnection(line, Util.indexOf.call(this.tConns, line));
        if (line.target == this)
            line.target = null;
        Util.removeObject.call(this.tConns, line);
    },
    createLineEditPart: function (model) {
        return new anra.gef.LineEditPart(model);
    },
    findLineEditPart: function (model) {
        return this.getRoot().getEditPart(model);
    },
    createOrFindConnection: function (model) {
        var linepart = this.findLineEditPart(model);
        if (linepart == null) {
            linepart = this.createLineEditPart(model);
            linepart.setModel(model);
        }
        return linepart;
    },
    unregisterVisuals: function () {
        if (this.figure.parent != null)
            this.figure.parent.removeChild(this.figure);
        else
            this.figure.dispose();
    },
    fireSourceConnectionAdded: function (line, i) {
        //TODO 增加连线事件类型
    },
    fireRemovingSourceConnection: function (line, i) {
        //TODO
    },
    fireTargetConnectionAdded: function (line, i) {
    },
    fireRemovingTargetConnection: function (line, i) {

    }
});

anra.gef.RootEditPart = anra.gef.EditPart.extend({
    layers: null,
    class: 'RootEditPart',
    constructor: function () {
        anra.gef.EditPart.prototype.constructor.call(this);
        this.editPartMap = new Map();
        this.layers = new Map();
    },
    createDragTracker: function () {
        return new anra.gef.RootDragTracker();
    },
    setSelection: function (o) {
        if (this.editor != null)
            this.editor.hideContextMenu(o);
        if (this.selection instanceof Array && o instanceof Array && this.selection.length == o.length) {
            var f = true;
            for (i = 0; i < o.length; i++) {
                if (this.selection[i] != o[i]) {
                    f = false;
                    break;
                }
            }
            if (f)return;
        }
        if (this.selection == o || (this.selection != null && this.selection instanceof Array && Util.contains.call(this.selection, o)))return;
        this.clearSelection();
        this.selection = o;
        if (o instanceof Array) {
            for (var i = 0; i < o.length; i++)
                o[i].setSelected(constants.SELECTED_PRIMARY);
        } else if (o instanceof anra.gef.EditPart) {
            o.setSelected(constants.SELECTED_PRIMARY);
        }
    },
    clearSelection: function () {
        if (this.selection != null) {
            var o = this.selection;
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++)
                    o[i].setSelected(constants.SELECTED_NONE);
            } else if (o instanceof anra.gef.EditPart) {
                o.setSelected(constants.SELECTED_NONE);
            }
        }
    },
    getRoot: function () {
        return this;
    },
    createLayer: function () {
        if (this.figure != null) {
            var painterLayer = new anra.svg.Group();
            var primaryLayer = new anra.svg.Group();
            var lineLayer = new anra.svg.Group();
            var handleLayer = new anra.svg.Group();
            var feedbackLayer = new anra.svg.Group();
            var menuLayer = new anra.svg.Group();
            this.figure.addChild(painterLayer);
            this.figure.addChild(primaryLayer);
            this.figure.addChild(lineLayer);
            this.figure.addChild(handleLayer);
            this.figure.addChild(feedbackLayer);
            this.figure.addChild(menuLayer);
            this.layers.set(anra.gef.RootEditPart.PainterLayer, painterLayer);
            this.layers.set(anra.gef.RootEditPart.PrimaryLayer, primaryLayer);
            this.layers.set(anra.gef.RootEditPart.LineLayer, lineLayer);
            this.layers.set(anra.gef.RootEditPart.HandleLayer, handleLayer);
            this.layers.set(anra.gef.RootEditPart.FeedbackLayer, feedbackLayer);
            this.layers.set(anra.gef.RootEditPart.MenuLayer, menuLayer);
        }
    },
    getMenuLayer: function () {
        return this.getLayer(anra.gef.RootEditPart.MenuLayer);
    },
    getLineLayer: function () {
        return this.getLayer(anra.gef.RootEditPart.LineLayer);
    },
    getPainterLayer: function () {
        return this.getLayer(anra.gef.RootEditPart.PainterLayer);
    },
    getHandleLayer: function () {
        return this.getLayer(anra.gef.RootEditPart.HandleLayer);
    },
    getPrimaryLayer: function () {
        return this.getLayer(anra.gef.RootEditPart.PrimaryLayer);
    },
    getFeedbackLayer: function () {
        return this.getLayer(anra.gef.RootEditPart.FeedbackLayer);
    },
    getLayer: function (key) {
        return this.layers.get(key);
    },
    addChildVisual: function (child, index) {
        this.getPrimaryLayer().addChild(child.getFigure());
    },
    removeChildVisual: function (child) {
        this.getPrimaryLayer().removeChild(child.getFigure());
    },
    regist: function (editPart) {
        this.editPartMap.put(editPart.model, editPart);
    },
    unregist: function (editPart) {
        this.editPartMap.remove(editPart.model);
    },
    getEditPart: function (model) {
        return this.editPartMap.get(model);
    },
    _initFigureListeners: function () {
        anra.gef.EditPart.prototype._initFigureListeners.call(this);
        var root = this;
        this.figure.on(anra.EVENT.ContextMenu, function (e) {
            root.editor.showContextMenu(root.selection, e);
        });
    }
});

anra.gef.RootEditPart.PrimaryLayer = "Primary_Layer";
anra.gef.RootEditPart.HandleLayer = "Handle_Layer";
anra.gef.RootEditPart.FeedbackLayer = "Feedback_Layer";
anra.gef.RootEditPart.DefineLayer = "defineLayer";
anra.gef.RootEditPart.PainterLayer = "painterLayer";
anra.gef.RootEditPart.LineLayer = "lineLayer";
anra.gef.RootEditPart.MenuLayer = "MenuLayer";

anra.gef.LineEditPart = anra.gef.EditPart.extend({
    target: null,
    source: null,
    setTarget: function (t) {
        if (this.target == t)
            return;
        if (this.target != null)
            this.dettachTarget();
        this.target = t;
        if (t != null)
            this.setParent(t.getRoot());
        else if (this.source == null)
            this.setParent(null);
        if (this.source != null && this.target != null)
            this.refresh();
    },
    deactivate: function () {
        var i;
        for (i = 0; i < this.children.length; i++) {
            this.children[i].deactivate();
        }
        this.deactivePolicies();

        if (this.model.targetNode != null) {
            this.model.targetNode.removeTargetLine(this.model);
            this.model.targetNode = null;
        }
        if (this.model.sourceNode != null) {
            this.model.sourceNode.removeSourceLine(this.model);
            this.model.sourceNode = null;
        }
        this.setFlag(FLAG_FOCUS, false);
    },
    setSource: function (t) {
        if (this.source == t)
            return;
        if (this.source != null)
            this.dettachSource();
        this.source = t;
        if (t != null)
            this.setParent(t.getRoot());
        else if (this.target == null)
            this.setParent(null);
        if (this.source != null && this.target != null)
            this.refresh();
    },
    setParent: function (parent) {
        var wasNull = this.parent == null;
        var becomingNull = parent == null;
        if (becomingNull && !wasNull)
            this.removeNotify();
        this.parent = parent;
        if (wasNull && !becomingNull)
            this.addNotify();
    },
    unregisterVisuals: function () {
        this.deactivateFigure();
    },
    deactivateFigure: function () {
        this.getRoot().getLineLayer().removeChild(this.figure);
        this.figure.setSourceAnchor(null);
        this.figure.setTargetAnchor(null);
    },
    registerAccessable: function () {
        this.getRoot().regist(this);
    },
    unregisterAccessable: function () {
        this.getRoot().unregist(this);
    },
    registerVisuals: function () {
        this.activateFigure();
    },
    activateFigure: function () {
        this.getRoot().getLineLayer().addChild(this.getFigure());
    },
    getRoot: function () {
        return this.parent.getRoot();
    },
    refresh: function () {
        if (this.figure == null) {
            this.getRoot().getLineLayer().addChild(this.getFigure());
        }
        this.refreshSourceAnchor();
        this.refreshTargetAnchor();
        this.refreshVisual();
        this.refreshChildren();
    },
    refreshSourceAnchor: function () {
        this.figure.setSourceAnchor(this.getSourceAnchor());
    },
    refreshTargetAnchor: function () {
        this.figure.setTargetAnchor(this.getTargetAnchor());
    },
    getSourceAnchor: function () {
        if (this.source != null)
            return this.source.getSourceAnchorByTerminal(this.model.get('exit'));
        return {x: 0, y: 0};
    },
    getTargetAnchor: function () {
        if (this.target != null)
            return this.target.getTargetAnchorByTerminal(this.model.get('entr'));
        return {x: 100, y: 100};
    },
    attachSource: function () {
        this.source.model.addSourceLine(this.model);
        this.source.refresh();
    },
    attachTarget: function () {
        this.target.model.addTargetLine(this.model);
        this.target.refresh();
    },
    dettachSource: function (refresh) {
        if (this.source == null)return;
        this.source.model.removeSourceLine(this.model);
        if (refresh)
            this.source.refresh();
    },
    dettachTarget: function (refresh) {
        if (this.target == null)return;
        this.target.model.removeTargetLine(this.model);
        if (refresh)
            this.target.refresh();
    }
});


anra.gef.Tool = Base.extend({
    activate: function () {
    },
    deactivate: function () {
    },
    getEventDispatcher: function () {
        return this.editor.rootEditPart.getFigure().svg.dispatcher;
    },
    notifyListeners: function (eventType, func) {
        //TODO
    },
    disableEvent: function () {
    },
    enableEvent: function () {
    },
    mouseUp: function (e, p) {
//        if (this.dragEnd != null)
//            this.dragEnd(e, p);
        this.editor.setActiveTool(this.editor.getDefaultTool());
    }
});

anra.gef.SelectionTool = anra.gef.Tool.extend({
    id: 'selection tool',
    mouseDown: function (e, p) {
        if (p.getRoot == null)return;
        p.getRoot().setSelection(p);
    },
    dragStart: function (e, p) {
        if (p instanceof anra.gef.RootEditPart) {
            if (this.marqueeTool == null)
                this.marqueeTool = new anra.gef.MultiSelectionTool();
            this.editor.setActiveTool(this.marqueeTool);
        }
    }
});
anra.gef.MultiSelectionTool = anra.gef.Tool.extend({
    id: 'multi selection tool',
    dragEnd: function (e, p) {
        if (this.marquee != null)
            this.editor.rootEditPart.getFeedbackLayer().removeChild(this.marquee);
        this.marquee = null;
        this.editor.setActiveTool(this.editor.getDefaultTool());
    },
    mouseUp: function (e, p) {
        this.dragEnd(e, p);
    },
    mouseDrag: function (e, p) {
        var marquee = this.getMarqueeVisual(e);
        this.refreshMarquee(marquee, e);
        this.calculateSelection(marquee);
    },
    getMarqueeVisual: function (e) {
        if (this.marquee == null) {
            this.marquee = new anra.svg.Control();
            this.marquee.setOpacity(0.3);
            this.marquee.disableEvent();
            this.marquee.setAttribute({
                stroke: 'black',
                fill: 'grey'
            });
            this.marquee.x = e.x;
            this.marquee.y = e.y;
            this.editor.rootEditPart.getFeedbackLayer().addChild(this.marquee);
        }
        return this.marquee;
    },
    calculateSelection: function (marquee) {
        var b = marquee.bounds;
        var children = this.editor.rootEditPart.children;
        var selection = [];
        for (var i = 0; i < children.length; i++) {
            if (anra.Rectangle.observe(b, children[i].figure.bounds))
                selection.push(children[i]);
        }
        this.editor.rootEditPart.setSelection(selection);
    },
    refreshMarquee: function (f, e) {
        var nx = e.x;
        var ny = e.y;
        var mX = f.x < nx ? f.x : nx;
        var mY = f.y < ny ? f.y : ny;
        f.setBounds({
            x: mX,
            y: mY,
            width: Math.abs(f.x - nx),
            height: Math.abs(f.y - ny)
        }, true);
    }
});
/**
 * this doesnot work unless target area has registed a anra.gef.LAYOUT_POLICY（which extends anra.gef.LayoutPolicy）
 * @type {*}
 */
anra.gef.CreationTool = anra.gef.Tool.extend({
    constructor: function (model) {
        this.model = model;
    },
    activate: function () {
        this.getEventDispatcher().mouseState = anra.EVENT.MouseDrag;
        this.getEventDispatcher().dragTarget = {model: this.model};
    },
    deactivate: function () {
        if (this.policy != null) {
            var v = this;
            var req = {
                target: v,
                type: constants.REQ_CREATE
            };
            this.policy.eraseTargetFeedback(req);
        }
    },
    mouseDown: function () {
        this.getEventDispatcher().mouseState = anra.EVENT.MouseDrag;
        return true;
    },
    getEditPart: function (parentEditPart) {
        if (this.virtualEP == null) this.virtualEP = parentEditPart.createChild(this.model);
        return this.virtualEP;
    },
    mouseDrag: function (e, p) {
        var policy = this.getLayoutPolicy(e, p);
        if (this.policy == null) {
            this.policy = policy;
        }
        if (policy == null)return false;
        var v = this;
        var req = {
            editPart: p,
            target: v,
            event: e,
            type: constants.REQ_CREATE
        };
        if (this.policy != policy) {
            this.policy.eraseTargetFeedback(req);
            this.policy = policy;
        }
        policy.showTargetFeedback(req);

//        var c = policy.getCommand(req);
//        if (c != null && !c.canExecute()) {
//            return false;
//        }
        return true;
    },
    getLayoutPolicy: function (e, p) {
        if (p.getLayoutPolicy) {
            var policy = p.getLayoutPolicy();
            var parent = p;
            while (policy == null && parent != null) {
                policy = parent.getLayoutPolicy();
                parent = parent.parent;
            }
            return policy;
        }

        return null;
    },
    dragEnd: function (me, editPart) {
        if (editPart == null)return false;
        var policy = this.getLayoutPolicy(me, editPart);
        if (policy == null)return false;
        var v = this;
        var req = {
            editPart: editPart,
            target: v,
            event: me,
            type: constants.REQ_CREATE
        };
        policy.eraseTargetFeedback(req);
        var cmd = policy.getCommand(req);
        if (cmd != null && cmd.canExecute()) {
            editPart.getRoot().editor.execute(cmd);
        } else {
            return this.dragEnd(me, editPart.parent)
        }
        return true;
    },
    getCommand: function (e, p) {
        return new anra.gef.CreateNodeCommand();
    }
});
/**
 * 连线工具
 * @type {*}
 */
anra.gef.LinkLineTool = anra.gef.Tool.extend({
    id: 'link tool',
    type: null,
    constructor: function (m) {
        this.model = m;
        this.type = constants.REQ_CONNECTION_START;
    },
    activate: function () {
        //根控制器激活连线模式，展示UI
        //原先代码
        var policy = this.editor.rootEditPart.getConnectionPolicy();
        if (policy != null)
            policy.showSourceFeedback({type: constants.REQ_CONNECTION_MOD});
    },
    deactivate: function () {
        //清除连线模式的UI
        //原先代码
        var policy = this.editor.rootEditPart.getConnectionPolicy();
        if (policy != null)
            policy.eraseSourceFeedback({type: constants.REQ_CONNECTION_MOD});
        this.reset();
    },
    mouseOut: function (e, p) {
        if (p instanceof anra.gef.NodeEditPart) {
            var policy = p.getConnectionPolicy();
            var v = this;
            var req = {
                editPart: p,
                target: v,
                event: e,
                type: v.type
            };
            if (policy != null) {
                if (this.type !== constants.REQ_CONNECTION_END)
                    policy.eraseSourceFeedback(req);
                policy.eraseTargetFeedback(req);
            }
        }
    },
    mouseMove: function (e, p) {
        var req = {
            editPart: p,
            target: this,
            event: e,
            type: this.type
        };
        var policy;
        if (this.type == constants.REQ_CONNECTION_END || this.type == constants.REQ_RECONNECT_TARGET) {
            policy = p.getConnectionPolicy && p.getConnectionPolicy();
            policy && policy.showTargetFeedback(req);
            this.refreshGuideLine(req, p);
        } else if (this.type == constants.REQ_RECONNECT_SOURCE || this.type == constants.REQ_CONNECTION_START) {
            policy = p.getConnectionPolicy && p.getConnectionPolicy();
            policy && policy.showSourceFeedback(req);
            this.refreshGuideLine(req, p);
        }
        return true;
    },
    createGuideLine: function (editPart) {
        return editPart.createLineEditPart(this.model).createFigure();
    },
    createGuideAnchor() {
        let handle = new anra.svg.Control();
        handle.setAttribute({
            'fill-opacity': 0,
            'stroke-opacity': 0.9,
            'stroke': '#FF69B4',
            'stroke-width': 5,
        });
        return handle;
    },
    removeGuideLine: function () {
        if (this.type == constants.REQ_RECONNECT_SOURCE || this.type == constants.REQ_RECONNECT_TARGET) {
            this.linePart.figure.enableEvent();
            this.linePart.refresh();
        }
        else if (this.type == constants.REQ_CONNECTION_END && this.guideLine != null) {
            this.editor.rootEditPart.getFeedbackLayer().removeChild(this.guideLine);
            this.editor.rootEditPart.getFeedbackLayer().removeChild(this.sourceGuideAnchor);
            this.editor.rootEditPart.getFeedbackLayer().removeChild(this.targetGuideAnchor);
        }

    },
    refreshGuideLine: function (req, p) {
        if (this.type == constants.REQ_CONNECTION_START) {
            return;
        }

        if (p instanceof anra.gef.RootEditPart && this.guideLine == null){
            return;
        }

        var anchor = {x: req.event.x, y: req.event.y};
        if (this.type == constants.REQ_CONNECTION_END) {
            if (this.guideLine == null) {
                this.guideLine = this.createGuideLine(this.sourceEditPart);
                this.editor.rootEditPart.getFeedbackLayer().addChild(this.guideLine);
                //anchor == null
                anchor = p.getSourceAnchor(req);
                this.sourceGuideAnchor = this.createGuideAnchor();
                this.targetGuideAnchor = this.createGuideAnchor();
                this.targetGuideAnchor.setBounds({x: anchor.x - 10, y: anchor.y - 10, width: 20, height: 20});
                this.sourceGuideAnchor.setBounds({x: anchor.x - 10, y: anchor.y - 10, width: 20, height: 20});
                this.editor.rootEditPart.getFeedbackLayer().addChild(this.sourceGuideAnchor);
                this.editor.rootEditPart.getFeedbackLayer().addChild(this.targetGuideAnchor);
                //指向实际节点的model，如果修改了会产生问题
                this.guideLine.model = {sourceNode: this.sourceEditPart.model, targetNode: null};
                this.guideLine.setSourceAnchor(anchor);
                this.guideLine.disableEvent();
            }
            //无法连接同一节点的锚点
            this.editor.rootEditPart.figure.dispatcher.dragTarget = this.guideLine.figure;

            if (p instanceof anra.gef.NodeEditPart)
                anchor = p.getTargetAnchor(req);
            this.targetGuideAnchor.setBounds({x: anchor.x - 10, y: anchor.y - 10, width: 20, height: 20});


            this.guideLine.setTargetAnchor(anchor);
        } else if (this.type == constants.REQ_RECONNECT_SOURCE) {
            if (this.guideLine == null) {
                this.guideLine = this.linePart.figure;
                this.guideLine.disableEvent();
            }
            if (p instanceof anra.gef.NodeEditPart)
                anchor = p.getSourceAnchor(req);
            this.guideLine.setSourceAnchor(anchor);
        } else if (this.type == constants.REQ_RECONNECT_TARGET) {
            if (this.guideLine == null) {
                this.guideLine = this.linePart.figure;
                this.guideLine.disableEvent();
            }
            if (p instanceof anra.gef.NodeEditPart)
                anchor = p.getTargetAnchor(req);
            this.guideLine.setTargetAnchor(anchor);
        }
        this.guideLine.paint();
    },
    mouseDown: function (e, p) {
        if (p instanceof anra.gef.LineEditPart) {
            p.getRoot().setSelection(p);
        } else if (p instanceof anra.gef.NodeEditPart) {
            var policy = p.getConnectionPolicy();
            var v = this;
            var req = {
                editPart: p,
                target: v,
                event: e,
                type: v.type,
                anchor: p.getSourceAnchor({event: e}),
                model: v.model
            };

            if (policy) {
                this.command = policy.getCommand(req);
                policy.eraseTargetFeedback(req);
            }

            if (this.type == constants.REQ_CONNECTION_START) {
                this.type = constants.REQ_CONNECTION_END;
                this.sourceEditPart = p;
                this.sourceAnchor = p.getSourceAnchor({event: {x: e.x, y: e.y, source: p}});
                this.mouseMove(e, p);
            } else {
                policy.eraseSourceFeedback(req);
            }

        } else if (p instanceof anra.gef.RootEditPart && this.type == constants.REQ_CONNECTION_START) {
            p.getRoot().setSelection(p);
        }
    },
    mouseDrag: function (e, p) {
        if (this.type == constants.REQ_CONNECTION_START) {
            return;
        }

        if (this.type == constants.REQ_RECONNECT_SOURCE || this.type == constants.REQ_RECONNECT_TARGET) {
            var handles = this.linePart.policies.get('line selection').handles;
            if (handles) {
                handles.forEach(function (item) {
                    item.disableEvent();
                });
            }
            this.mouseMove(e, p);
            return true;
        }

        //确保p一定是mouseOntarget
        if (p.figure === e.prop.target) this.mouseMove(e, p);
        return true;
    },
    dragEnd: function (e, p) {
        if (this.type == constants.REQ_RECONNECT_SOURCE || this.type == constants.REQ_RECONNECT_TARGET) {
            var handles = this.linePart.policies.get('line selection').handles;
            if (handles) {
                handles.forEach(function (item) {
                    item.enableEvent();
                });
            }
        }

        if (this.type == constants.REQ_CONNECTION_END) {
            this.sourceEditPart.getConnectionPolicy().eraseSourceFeedback({});
        }

        this.mouseUp(e, p);
        return true;
    },
    mouseUp: function (e, p) {
        if (p instanceof anra.gef.NodeEditPart &&
            (this.type == constants.REQ_CONNECTION_END || this.type == constants.REQ_RECONNECT_TARGET || this.type == constants.REQ_RECONNECT_SOURCE)) {
            var policy = p.getConnectionPolicy();
            var v = this, anchor;

            if (this.guideLine) {
                anchor = this.type == constants.REQ_RECONNECT_TARGET ? this.guideLine.targetAnchor :
                    (this.type == constants.REQ_RECONNECT_SOURCE ? this.guideLine.sourceAnchor :
                        p.getTargetAnchor({
                            event: e
                        }));
            } else {
                anchor = p.getTargetAnchor({
                    event: e
                });
            }

            var req = {
                editPart: p,
                target: v,
                event: e,
                type: v.type,
                anchor: anchor,
                command: v.command,
                line: v.linePart
            };
            if (policy != null) {
                this.command = policy.getCommand(req);
                policy.eraseSourceFeedback(req);
                policy.eraseTargetFeedback(req);
            }
            if (this.command != null) {
                p.getRoot().editor.execute(this.command);
            }
        }

        if (this.type == constants.REQ_RECONNECT_TARGET || this.type == constants.REQ_RECONNECT_SOURCE) {
            this.editor.setActiveTool(this.editor.getDefaultTool());
        }
        this.reset();
        return true;
    },
    reset: function () {
        this.removeGuideLine();
        this.type = constants.REQ_CONNECTION_START;
        this.targetAnchor = null;
        this.targetEditPart = null;
        this.sourceAnchor = null;
        this.sourceEditPart = null;
        this.guideLine = null;
        this.command = null;
    },
    create: function (editPart) {
        if (editPart != null) {
            return editPart.createLineEditPart(this.model);
        }
    }
})
;

/**
 * DragTracker总控，如果子DragTracker对应方法不为true，则交由父级处理
 *
 * @type {*}
 */
anra.gef.TopDragTracker = Base.extend({
    constructor: function (editor) {
        this.editor = editor;
    },
    invoke: function (me, editPart, dragTracker, method) {
        return dragTracker && dragTracker[method] != null &&
            dragTracker[method](me, editPart);
    },
    invokeLoop: function (me, editPart, method) {
        var p = editPart;
        while (p != null && ( p.getDragTracker == null || !this.invoke(me, p, p.getDragTracker(), method) && p.parent != null)) {
            p = p.parent;
        }
    },
    getActiveTool: function () {
        return this.editor.getActiveTool();
    },
    mouseMove: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseMove'))
            this.invokeLoop(me, editPart, 'mouseMove');
    },
    mouseDown: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseDown'))
            this.invokeLoop(me, editPart, 'mouseDown');
    },
    dragDropped: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'dragDropped'))
            this.invokeLoop(me, editPart, 'dragDropped');
    },
    mouseClick: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseClick'))
            this.invokeLoop(me, editPart, 'mouseClick');
    },
    dragStart: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'dragStart'))
            this.invokeLoop(me, editPart, 'dragStart');
    },
    mouseDrag: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseDrag'))
            this.invokeLoop(me, editPart, 'mouseDrag');
    },
    dragEnd: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'dragEnd'))
            this.invokeLoop(me, editPart, 'dragEnd');
    },
    mouseUp: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseUp'))
            this.invokeLoop(me, editPart, 'mouseUp');
    },
    mouseIn: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseIn'))
            this.invokeLoop(me, editPart, 'mouseIn');
    },
    mouseOut: function (me, editPart) {
        if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseOut'))
            this.invokeLoop(me, editPart, 'mouseOut');
    }
});

/**
 * 处理EditPart级别的鼠标事件
 * @type {*}
 */
anra.gef.RootDragTracker = Base.extend({
    mouseDown: function (me, editPart) {
//        editPart.getRoot().setSelection(editPart);
    },
    mouseClick: function (me, editPart) {
    },
    dragStart: function (me, editPart) {
        var req = {
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_DRAG_START
        };

        editPart.showTargetFeedback(req);
    },
    mouseDrag: function (me, editPart) {
        var req = {
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_MOVE
        };

        editPart.showTargetFeedback(req);
    },
    dragEnd: function (me, editPart) {
        var req = {
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_MOVE
        };
        var cmd = editPart.getCommand(req);
        if (cmd != null) {
            editPart.getRoot().editor.execute(cmd);
        }
        editPart.eraseTargetFeedback(req);
    },
    mouseUp: function (me, editPart) {
        var req = {
            editPart: editPart,
            event: me,
            type: constants.REQ_MOUSE_UP
        };
        editPart.eraseTargetFeedback(req);
    }
});


anra.gef.DragTracker = anra.gef.RootDragTracker.extend({

    mouseDrag: function (me, editPart) {
    },

    dragStart: function (me, editPart) {
        var bounds = editPart.figure.getClientArea();
        me.offsetX = bounds[0] - me.x;
        me.offsetY = bounds[1] - me.y;
        return false;
    },
    dragEnd: function (me, editPart) {
        var req = {
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_MOVE
        };
        if (req.type == null)return false;
        var cmd = editPart.getCommand(req);
        if (cmd != null) {
            editPart.getRoot().editor.execute(cmd);
        }
        editPart.eraseTargetFeedback(req);
        return cmd != null && cmd.canExecute();
    },
    mouseDown: function (me, editPart) {
//        editPart.getRoot().setSelection(editPart);
        return true;
    }
});


anra.gef.RelocalCommand = anra.Command.extend({
    constructor: function (editPart, sp, ep) {
        this.sp = sp;
        this.ep = ep;
        this.model = editPart.model;
        this.editPart = editPart;
    },
    dispose: function () {
        this.editPart = null;
    },
    canExecute: function () {
        return this.model != null && this.sp != null && this.ep != null;
    },
    execute: function () {
        var b = this.editPart.model.get('bounds'), parent = this.editPart.parent;

        if (parent instanceof anra.gef.RootEditPart) {
            this.model.set('bounds', [this.ep.x, this.ep.y, b[2], b[3]]);
        } else {
            var loc = [parent.getFigure().getAttr('x', parseFloat),
                parent.getFigure().getAttr('y', parseFloat)];
            this.model.set('bounds', [this.ep.x - loc[0],
                this.ep.y - loc[1],
                b[2],
                b[3]]);
        }

        this.editPart.refresh();
    },
    undo: function () {
        var b = this.model.get('bounds');
        this.model.set('bounds', [this.sp.x, this.sp.y, b[2], b[3]]);
        this.editPart.refresh();
    }

});

anra.gef.DeleteNodeAndLineCommand = anra.ChainedCompoundCommand.extend({
    constructor: function (root, node) {
        this.commandList = [];

        this.nodes = [];
        this.lines = new Map();
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                this.collectCommands(node[i]);
            }
        } else {
            this.collectCommands(node);
        }

        this.lines.forEach(function (v) {
            this.add(new anra.gef.DeleteLineCommand(root, v));
        }, this);

        for (i = 0; i < this.nodes.length; i++) {
            this.add(new anra.gef.DeleteNodeCommand(root, this.nodes[i]));
        }

    },
    collectCommands: function (node) {
        var targetLines = node.tConns;
        var sourceLines = node.sConns;
        if (targetLines != null) {
            for (var i = 0; i < targetLines.length; i++) {
                this.lines.put(targetLines[i].model, targetLines[i]);
            }
        }
        if (sourceLines != null) {
            for (i = 0; i < sourceLines.length; i++) {
                this.lines.put(sourceLines[i].model, sourceLines[i]);
            }
        }
        this.nodes.push(node)
    }
});

/**
 * 删除节点的command
 * @type {*}
 */
anra.gef.DeleteNodeCommand = anra.Command.extend({
    constructor: function (root, selection) {
        this.root = root;
        if (selection instanceof anra.gef.EditPart)
            this.node = selection;
        else if (selection instanceof anra.gef.BaseModel) {
            this.node = this.root.getEditPart(selection);
            if (this.node == null)
                throw 'can not delete model ' + selection.props.id;
        }
    },
    canExecute: function () {
        return this.root != null && this.node != null;
    },
    execute: function () {
        this.root.model.removeChild(this.node.model);
        this.root.refresh();
    },
    undo: function () {
        this.root.model.addChild(this.node.model);
        this.root.addChild(this.node);
        this.root.refresh();
    }
});

/**
 * 删除连线的command
 * @type {*}
 */
anra.gef.DeleteLineCommand = anra.Command.extend({
    constructor: function (root, line) {
        this.root = root;
        this.line = line;
//        console.log('--------init---------')
//        console.log(this.line.figure.owner)
//        console.log(this.line.source,this.line.target)
//        console.log('-----------------')
    },
    canExecute: function () {
        return this.root != null && this.line != null;
    },
    execute: function () {
//        console.log('removeline:',this.line.model.id)
//        console.log(this.line.source,this.line.target)
        if (this.snode == null)
            this.snode = this.line.source.model;
        if (this.tnode == null)
            this.tnode = this.line.target.model;


        this.sid = this.line.model.get('exit');
        this.tid = this.line.model.get('entr');

        this.line.dettachSource(true);
        this.line.dettachTarget(true);

        this.line.unregister();
        this.line.deactivate();
    },
    undo: function () {
        var s = this.root.getEditPart(this.snode);
        var t = this.root.getEditPart(this.tnode);

        this.line.setSource(s);
        this.line.setTarget(t);

        this.line.figure.setSourceAnchor(s.getSourceAnchorByTerminal(this.sid));
        this.line.figure.setTargetAnchor(t.getTargetAnchorByTerminal(this.tid));

        //如果不在attach前注册，node会创建一个新的lineEditPart
        this.line.register();

        this.line.attachSource(true);
        this.line.attachTarget(true);
        this.line.activate();
        //TODO 线的被选行为
        this.root.setSelection(this.line);
    }
});

/**
 * 创建节点Command
 * @param rootEditPart 根EditPart
 * @param node 节点模型
 */
anra.gef.CreateNodeCommand = anra.Command.extend({
    constructor: function (parentPart, node) {
        this.parentPart = parentPart;
        this.node = node;
    },
    canExecute: function () {
        return this.parentPart != null && this.node != null;
    },
    execute: function () {
        this.parentPart.model.addChild(this.node);
        this.parentPart.refresh();
    },
    undo: function () {
        this.parentPart.model.removeChild(this.node);
        this.parentPart.refresh();
    }
});


anra.gef.ReconnectSourceCommand = anra.Command.extend({
    execute: function () {
        this.oldSource = this.line.source;
        if (this.oldSource != this.source) {
            this.line.setSource(this.source);
            this.line.attachSource();
            this.oldSource.removeSourceConnection(this.line)
        }
        this.oldTerminal = this.line.model.get('exit');
        this.line.model.set('exit', this.terminal);
        this.line.model.set('source', this.line.source.model.get('id'))
        this.line.refresh();
    },
    undo: function () {
        if (this.oldSource != this.source) {
            this.line.setSource(this.oldSource);
            this.line.attachSource();
        }
        this.line.model.set('exit', this.oldTerminal);
        this.line.refresh();
    }
});

anra.gef.ReconnectTargetCommand = anra.Command.extend({
    execute: function () {
        this.oldTarget = this.line.target;
        if (this.oldTarget != this.target) {
            this.line.setTarget(this.target);
            this.line.attachTarget();
            this.oldTarget.removeTargetConnection(this.line);
        }
        this.oldTerminal = this.line.model.get('entr');
        this.line.model.set('entr', this.terminal);
        this.line.model.set('target', this.line.target.model.get('id'))
        this.line.refresh();

        /*        this.oldTarget = this.line.target;
         this.oldTerminal = this.line.model.get('entr');

         console.log(this.oldTerminal != this.terminal)
         if (this.oldTarget != this.target || this.oldTerminal != this.terminal) {
         this.line.setTarget(this.target);
         this.line.attachTarget();
         this.oldTarget.removeTargetConnection(this.line);
         }
         this.line.model.set('entr', this.terminal);
         this.line.refresh();*/

    },
    undo: function () {
        if (this.oldTarget != this.target) {
            this.line.setTarget(this.oldTarget);
            this.line.attachTarget();
        }
        this.line.model.set('entr', this.oldTerminal);
        this.line.refresh();
    }
});
/**
 * 创建连线command
 *
 * @param rootEditPart 根EditPart
 * @param line 连线模型
 * @param sourceId 源节点ID
 * @param targetId 目标节点ID
 */
anra.gef.CreateLineCommand = anra.Command.extend({

    constructor: function (rootEditPart, line, sourceId, targetId) {
        this.rootEditPart = rootEditPart;
        this.line = line;
        this.targetId = targetId;
        this.sourceId = sourceId;
    },
    canExecute: function () {
        return this.rootEditPart != null && this.line != null && this.sourceId != null && this.targetId != null
    },
    execute: function () {
        this.target = this.rootEditPart.model.getChild(this.targetId);
        this.source = this.rootEditPart.model.getChild(this.sourceId);
        if (this.target == null)
            anra.Platform.error('can not found line target id: ' + this.targetId);
        if (this.source == null)
            anra.Platform.error('can not found line source id: ' + this.sourceId);
        var flag = this.source.addSourceLine(this.line);

        if (!flag)return;
        flag &= this.target.addTargetLine(this.line);
        if (!flag)return;

        var sourcePart = this.sourcePart = this.rootEditPart.getEditPart(this.source);
        if (sourcePart != null)
            sourcePart.refresh();

        var targetPart = this.targetPart = this.rootEditPart.getEditPart(this.target);
        if (targetPart != null)
            targetPart.refresh();

        this.rootEditPart.setSelection(this.rootEditPart.getEditPart(this.line));
    },
    undo: function () {
        var linePart = this.sourcePart.getRoot().getEditPart(this.line);

        this.source.removeSourceLine(this.line);
        this.target.removeTargetLine(this.line);
        if (this.sourcePart != null)
            this.sourcePart.refresh();
        if (this.targetPart != null)
            this.targetPart.refresh();

        this.rootEditPart.setSelection(this.rootEditPart);
        linePart.unregister();
    }
});


anra.gef.ConstraintCommand = anra.Command.extend({
    constructor: function (editPart, sp, ep) {
        this.sp = sp;
        this.ep = ep;
        this.editPart = editPart;
    },
    canExecute: function () {
        return this.editPart != null && this.sp != null && this.ep != null;
    },
    execute: function () {
        var bounds = [this.ep.x, this.ep.y, this.ep.width, this.ep.height];
        this.editPart.model.set('bounds', bounds);
        this.editPart.refresh();
    },
    undo: function () {
        var bounds = [this.sp.x, this.sp.y, this.sp.width, this.sp.height];
        this.editPart.model.set('bounds', bounds);
        this.editPart.refresh();
    }
});

anra.gef.Policy = Base.extend({
    editPart: null,
    setHost: function (editPart) {
        this.editPart = editPart;
    },
    isActive: function () {
    },
    getHostFigure: function () {
        return this.editPart.getFigure();
    },
    getTargetEditPart: function (request) {
        return this.getHost();
    },
    getHost: function () {
        return this.editPart;
    },
    activate: function () {
        if (this.config && this.config.activate)
            this.config.activate.call(this);
    },
    deactivate: function () {
        if (this.config && this.config.deactivate)
            this.config.deactivate.call(this);
    },
    validatePolicy: function () {
    },
    getLineLayer() {
        return this.getHost().getRoot().getLayer(anra.gef.RootEditPart.LineLayer);
    },
    getHandleLayer: function () {
        return this.getHost().getRoot().getLayer(anra.gef.RootEditPart.HandleLayer);
    },
    getPrimaryLayer: function () {
        return this.getHost().getRoot().getLayer(anra.gef.RootEditPart.PrimaryLayer);
    },
    getFeedbackLayer: function () {
        return this.getHost().getRoot().getLayer(anra.gef.RootEditPart.FeedbackLayer);
    },
    eraseSourceFeedback: function (request) {
        if (this.config && this.config.eraseSourceFeedback)
            this.config.eraseSourceFeedback.call(this, request);
    },
    eraseTargetFeedback: function (request) {
        if (this.config && this.config.eraseTargetFeedback)
            this.config.eraseTargetFeedback.call(this, request);
    },
    showSourceFeedback: function (request) {
        if (this.config && this.config.showSourceFeedback)
            this.config.showSourceFeedback.call(this, request);
    },
    showTargetFeedback: function (request) {
        if (this.config && this.config.showSourceFeedback)
            this.config.showSourceFeedback.call(this, request);
    },
    getCommand: function (request) {
        if (this.config && this.config.getCommand)
            return this.config.getCommand.call(this, request);
    },
    removeHandle: function (figure) {
        this.getHandleLayer().removeChild(figure);
    },
    addHandle: function (figure) {
        this.getHandleLayer().addChild(figure);
    },
    removeFeedback: function (figure) {
        this.getFeedbackLayer().removeChild(figure);
    },
    addFeedback: function (figure) {
        this.getFeedbackLayer().addChild(figure);
    },
    on: function (k, f) {
        this.getHost().getRoot().$on(k, f);
    },
    emit: function (k, p, callback) {
        this.getHost().getRoot().$emit(k, p, callback);
    },
});
anra.gef.Policy.init = function (config) {
    if (typeof(config) == 'function')
        return new config();
    if (typeof(config) == 'object') {
        var P = anra.gef.Policy.extend(config);
        // var p = new anra.gef.Policy();
        return new P();
    }
    throw 'can not init policy :' + config
};
anra.gef.LAYOUT_POLICY = 'layoutPolicy';
anra.gef.CONNECTION_POLICY = 'CONNECTION_POLICY';

anra.gef.Palette = anra.gef.Figure.extend({});

anra.gef.Request = Base.extend({});
anra.gef.Editor = Base.extend({
    canvas: null,
    input: null,
    palette: null,
    element: null,
    rootEditPart: null,
    cmdStack: null,
    background: '#FFFFFF',
    setInput: function (input) {
        this.storeId = anra.Store.newStore(input.uuid);
        this.store = anra.Store.get(this.storeId);
        this.rootModel = this.createRootModel(input);
        this.rootModel.storeId = this.storeId;
        this.input2model(input, this.rootModel);
        console.log('editor created : ' + this.storeId);
    },
    createRootModel: function () {
        return new anra.gef.ContentModel();
    },
    input2model: function (input) {
        return input;
    },
    showContextMenu: function (selection, e) {
        if (this.menu == null) {
            this.menu = this.createContextMenu();
            this.rootEditPart.getMenuLayer().addChild(this.menu);
        }
        this.menu.show(this, e);
    },
    createContextMenu: function () {
        var menu = new anra.svg.DefMenu(this);
        return menu;
    },
    hideContextMenu: function () {
        if (this.menu != null)
            this.menu.hide();
    },
    createContent: function (parentId) {

        this.setActiveTool(this.getDefaultTool());

        this.element = document.getElementById(parentId);
        this.actionRegistry = new anra.ActionRegistry(this);
        this.registActions();
        if (this.element == null) {
            anra.Platform.error('GEF的父级元素不能为空');
            return;
        }
        //this.palette = this.createPalette(parentId);
        this.canvas = this.createCanvas(parentId);

        this._initCanvasListeners(this.canvas);

        this.rootEditPart = this.createRootEditPart();
        this.rootEditPart.editor = this;
        this.initRootEditPart(this.rootEditPart);
        this.rootEditPart.setModel(this.rootModel);
//        this.rootEditPart._initFigureListeners();
        this.rootEditPart.activate();
        this.cmdStack = new anra.CommandStack();
        this.rootEditPart.refresh();
    },
    _initCanvasListeners: function (cav) {
        var editor = this;
        this.canvas.on(anra.EVENT.KeyDown, function (e) {
            var action = editor.actionRegistry.keyHandle(e);

            if (action != null) {
                //need modify
                var _t = null;
                switch (action.type) {
                    case constants.ACTION_EDITOR:
                        action.editor = editor;
                        break;
                    case constants.ACTION_SELECTION:
                        action.selection = editor.rootEditPart.selection;
                        break;
                    case constants.ACTION_STACK:
                        action.stack = editor.cmdStack;
                }
                if (action.check == null || action.check())
                    action.run();
            }

        });
    },
    registActions: function () {

    },
    execute: function (c) {
        if (this.cmdStack != null)
            this.cmdStack.execute(c);
    },
    createRootEditPart: function () {
        var root = new anra.gef.RootEditPart();
        root.figure = this.canvas;
        root.setModel(this.models);
        root.createLayer();
        var policies = new Map();
        this.getCustomPolicies.call(policies);
        policies.forEach(function (v, k) {
            root.installEditPolicy(k, v);
        });
        return root;
    },
    getCustomPolicies: function () {
        return null;
    },
    initRootEditPart: function (editPart) {
    },
    _save: function () {
        this.doSave();
        this.cmdStack.markSaveLocation();
    },
    doSave: function () {
        //执行保存
        console.log('please override a doSave function', this.isDirty())
        this.cmdStack.markSaveLocation();
    },
    isDirty: function () {
        return this.cmdStack.isDirty();
    },
//    getDefaultTool:function () {
//        if (this.tool == null)
//            this.tool = new anra.gef.SelectionTool();
//        return this.tool;
//    },
    createPalette: function (id) {
        var i = id + 'Plt';
        var div = document.createElement('div');
        div.setAttribute('id', id + 'Plt');
        div.style.position = 'relative';
        div.style.width = '10%';
        div.style.height = '100%';
        div.style.float = 'left';
        div.style.backgroundColor = '#CCCCCC';
        this.element.appendChild(div);
        return new anra.gef.Palette(i);
    },
    createCanvas: function (id) {
        var i = id + 'Cav';
        var div = document.createElement('div');
        div.setAttribute('id', i);
        div.style.position = 'absolute';
        div.style.left = "150px";
        div.style.right = "0px";
        div.style.bottom = "30px";
        div.style.top = "0px";
        //div.style.width = 'auto';
        //div.style.height = '90%';
        div.style.float = 'left';
        div.style.overflowX = 'auto';
        div.style.overflowY = 'auto';
        div.style.background = this.background;
        this.element.appendChild(div);
        return new anra.SVG(i);
    },
    setActiveTool: function (tool) {
        if (this.activeTool == tool)return;
        if (this.activeTool != null) {
            this.activeTool.deactivate();
            this.activeTool.editor = null;
        }
        this.activeTool = tool;
        if (this.activeTool != null) {
            this.activeTool.editor = this;
            this.activeTool.activate();
        }
    },
    getActiveTool: function () {
        return this.activeTool;
    },
    getDefaultTool: function () {
        if (this.defaultTool == null) {
            this.defaultTool = new anra.gef.SelectionTool();
            this.defaultTool.editor = this;
        }
        return this.defaultTool;
    },
    getTopDragTracker: function () {
        if (this.topDragTracker == null)
            this.topDragTracker = this.createTopDragTracker();
        return this.topDragTracker;
    },
    createTopDragTracker: function () {
        return new anra.gef.TopDragTracker(this);
    },
    dispose() {
        anra.Store.remove(this.storeId);
        anra.Platform.unregist(this.canvas);
        if (this.element) {
            this.element.removeChild(this.canvas.element);
            this.element = null;
        }
        this.rootEditPart.selection = null;
        this.rootEditPart.editor = null;
        this.rootEditPart.getLayoutPolicy().editPart = null;
        this.selection = null;

    }
});


/**
 * 连线
 * @type {*}
 */
anra.gef.Line = anra.gef.Figure.extend(anra.svg.Polyline).extend({
    sourceAnchor: null,
    targetAnchor: null,
    router: null,
    _markListener: null,
    setStartMarker: function (marker) {
        this._setMarker('marker-start', marker);
    },
    setEndMarker: function (marker) {
        this._setMarker('marker-end', marker);
    },
    getStartMarker: function () {
        return this['marker-start'];
    },
    getEndMarker: function () {
        return this['marker-end'];
    },
    _setMarker: function (key, marker) {
        var m = this[key];
        if (m == marker)return;
        if (m != null) {
            this.svg.defs.removeChild(m);
            this.removeAttribute(key);
            this.removeRepaintListener(m.repaintListener);
        }
        this[key] = marker;
        if (marker != null) {
            // if (marker.propertyChanged != null && this.model != null)
            //     this.model.addPropertyListener(marker, marker.propKey);
            this.svg.defs.addChild(marker);
            this.setAttribute(key, 'url(#' + marker.id + ')');
            marker.repaintListener = function (e) {
                marker.refresh(e);
            };
            this.addRepaintListener(marker.repaintListener);
        }
    },
    dispose: function () {
        this.setStartMarker(null);
        this.setEndMarker(null);
        anra.gef.Figure.prototype.dispose.call(this);
    },
    paint: function () {
        if (this.router != null)
            this.points = this.router(this);
        var f = this;
        if (this.sourceAnchor != null && this.targetAnchor != null)
            this.setAttribute({
                d: f.compute()
            });
        this.fireRepaintListener();
    },
    setSourceAnchor: function (anchor) {
        this.sourceAnchor = anchor;
        if (anchor == null)
            return;
        if (this.points == null)
            this.points = [];
        this.points[0] = anchor;
        if (this.points.length > 1)
            this.points[0] = ({
                x: anchor.x,
                y: anchor.y
            });
        else
            Util.insert.call(this.points, {
                x: anchor.x,
                y: anchor.y
            });
    },
    setTargetAnchor: function (anchor) {
        this.targetAnchor = anchor;
        if (anchor == null)
            return;
        if (this.points == null)
            this.points = [];
        if (this.points.length > 1)
            this.points[this.points.length - 1] = ({
                x: anchor.x,
                y: anchor.y
            });
        else
            this.points.push({
                x: anchor.x,
                y: anchor.y
            });
    },
    getStartPoint: function () {
        return this.sourceAnchor;
//        return this.points == null || this.points.length == 0 ? null : this.points[0];
    },
    getEndPoint: function () {
        return this.targetAnchor;
//        return this.points == null || this.points.length == 0 ? null : this.points[this.points.length - 1];
    }
});
var setPoint = function (o, t) {
    if (s != null)
        for (var k in t) {
            o[k] = t[k];
        }
};
/**
 * 曲线
 * @type {*|void}
 */
anra.gef.CurveLine = anra.gef.Line.extend({
    strategy: anra.svg.LineStrategy.CornerCurve
});

/**
 * 路径线
 * @type {*|void}
 */
anra.gef.PathLine = anra.gef.Line.extend({
    points: null,
    tagName: 'path'

});


anra.gef.BaseModel = Base.extend({
    pls: null,
    props: null,
    constructor: function () {
        this.props = {};
    },
    /**
     * 输入应当为json
     * @param p
     * @param fire
     */
    setValues: function (p, unfire) {
        for (var key in p) {
            this.set(key, p[key], unfire);
        }
    },
    set: function (key, value, unfire) {
        var o = this.props[key];

        if (this.store) {
            var _tj = {};
            _tj[key] = value;
            this.props = this.store.update(_tj).first();
        } else
            this.props[key] = value;

        if (this.pls && !unfire)
            this.pls.firePropertyChanged(key, o, value);
    },
    get: function (key) {
        return this.props[key];
    },
    addPropertyListener: function (l, k) {
        if (this.pls == null)
            this.pls = new anra.PropertyListenerSupport();
        this.pls.addPropertyListener(l, k);
    },
    removePropertyListener: function (l, k) {
        if (this.pls != null)
            this.pls.removePropertyListener(l, k);
    },
    hashCode: function () {
        if (this.uuid == null)
            this.uuid = anra.genUUID();
        return this.uuid;
    }
});

anra.gef.NodeModel = anra.gef.BaseModel.extend({
    sourceLines: null,
    targetLines: null,
    children: null,
    constructor: function () {
        anra.gef.BaseModel.prototype.constructor.call(this);
        this.sourceLines = new Map();
        this.targetLines = new Map();
        this.children = {};
    },
    hasSourceLine: function (line) {
        if (line instanceof anra.gef.LineModel) {
            return this.sourceLines.has(this.lineId(line.props.id))
        } else {
            return this.sourceLines.has(line);
        }
    },
    hasTargetLine: function (line) {
        if (line instanceof anra.gef.LineModel) {
            return this.targetLines.has(this.lineId(line.get('id')));
        } else {
            return this.targetLines.has(line);
        }
    },
    addSourceLine: function (line) {
        var nId = this.lineId(line.get('id'));
        line.sourceNode = this;
        if (!this.sourceLines.has(nId)) {
            this.sourceLines.put(nId, line);
            if (this.storeId) {
                if (line.store) {
                    line.store.update(line.props);
                } else {
                    line.store = anra.Store.get(this.storeId).line.insert(line.props);
                }
            }

            return true;
        }
        console.log('duplicate line id: ' + line.props.id);
        return false;
    },
    addTargetLine: function (line) {
        var nId = this.lineId(line.get('id'));
        line.targetNode = this;
        if (!this.targetLines.has(nId)) {
            this.targetLines.put(nId, line);
            if (this.storeId) {
                if (line.store) {
                    line.store.update(line.props);
                } else {
                    line.store = anra.Store.get(this.storeId).line.insert(line.props);
                }
            }

            return true;
        }
        console.log('duplicate line id: ' + line.props.id);
        return false;
    },
    getSourceLine: function (id) {
        return this.sourceLines.get(this.lineId(id));
    },
    getTargetLine: function (id) {
        return this.targetLines.get(this.lineId(id));
    },
    lineId: function (id) {
        return this.props.id + '_' + id;
    },
    removeSourceLine: function (line) {
        var l, lk;
        if (line instanceof anra.gef.LineModel)
            lk = this.lineId(line.props.id);
        else
            lk = this.lineId(line);
        l = this.sourceLines.remove(lk);
        if (l != null)
            l.sourceNode = null;
        if (line.store) {
            line.store.update({source: null});
        }
    },
    removeTargetLine: function (line) {
        var l, lk;
        if (line instanceof anra.gef.LineModel)
            lk = this.lineId(line.get('id'));
        else
            lk = this.lineId(line);
        l = this.targetLines.remove(lk);
        if (l != null)
            l.targetNode = null;

        if (line.store) {
            line.store.update({target: null});
        }
    },
    addChild: function (model, callback) {
        this.children[model.get('id')] = model;
        model.storeId = this.storeId;

        var oldStore = anra.Store.get(this.storeId).node({id: model.get('id')});
        if (oldStore.first()) {
            console.error('duplicate model : ' + model.get('id'));
            model.store = oldStore.update(model.props);
        } else {
            model.store = anra.Store.get(this.storeId).node.insert(model.props);
        }
        callback && callback(model);
    },
    removeChild: function (model, callback) {
        delete this.children[model.get('id')];
        anra.Store.get(this.storeId, 'node')({id: model.get('id')}).remove();
        callback && callback(model);
    },
    getChild: function (id) {
        return this.children[id];
    },
    getAllChildren: function () {
        var c = [];
        for (var key in this.children) {
            c.push(this.children[key]);
        }
        return c;
    },
    equals: function (o) {
        return this == o || this.props.id == o.props.id;
    }
});

anra.gef.ContentModel = anra.gef.NodeModel.extend({});

anra.gef.LineModel = anra.gef.BaseModel.extend({
    equals: function (o) {
        return this == o || this.props.id == o.props.id;
    }
});

anra.gef.EditPartListener = Base.extend({
    class: 'anra.gef.EditPartListener',
    childAdded: function (child, index) {
    },
    partActivated: function (editPart) {
    },
    partDeactivated: function (editpart) {
    },
    removingChild: function (child, index) {
    },
    selectedStateChanged: function (editPart) {
    }
});

anra.FigureUtil = {
    createGhostFigure: function (editPart) {
        var ghost = editPart.createFigure();

        ghost.oncreated = function () {
            editPart.refreshVisual.call({
                figure: ghost,
                model: editPart.model
            });
        };

        if (editPart instanceof anra.gef.LineEditPart) {
            ghost.setSourceAnchor(editPart.figure.sourceAnchor);
            ghost.setTargetAnchor(editPart.figure.targetAnchor);
            if (editPart.figure.points) ghost.points = [...editPart.figure.points];
        }

        ghost.setOpacity(0.5);
        ghost.disableEvent();
        return ghost;
    },
    createGhostFigureWithLine(editPart) {
        const isNode = editPart instanceof anra.gef.NodeEditPart;

        if (!isNode) return null;

        let nodeGhost = anra.FigureUtil.createGhostFigure(editPart);

        //No Lines
        if (editPart.getModelSourceLines().length +　editPart.getModelTargetLines().length == 0) {
            return {
                node: nodeGhost,
                sourceLines: [],
                targetLines: [],
            };
        }

        /*let sourceLineGhost = editPart.sConns.map(linePart => [anra.FigureUtil.createGhostFigure(linePart), linePart.model.get('exit')]),
            targetLineGhost = editPart.tConns.map(linePart => [anra.FigureUtil.createGhostFigure(linePart), linePart.model.get('entr')]);

        //通过setBounds刷新线的位置

        nodeGhost.setBounds = function(b) {
            anra.svg.Control.prototype.setBounds.call(nodeGhost, b);

            sourceLineGhost.forEach(([line, anchor]) => {
                line.setSourceAnchor(nodeGhost.getSourceAnchorByTerminal(anchor));

                line.paint();
            });

            targetLineGhost.forEach(([line, anchor]) => {
                line.setTargetAnchor(nodeGhost.getSourceAnchorByTerminal(anchor));

                line.paint();
            });

        }

        return {
            node: nodeGhost,
            sourceLine: sourceLineGhost.map(([line, anchor]) => line),
            targetLine: targetLineGhost.map(([line, anchor]) => line),
            line: sourceLineGhost.map(([line, anchor]) => line).concat(
                targetLineGhost.map(([line, anchor]) => line)
            ),
        };*/

        let sourceLineGhost = editPart.sConns.map(linePart => {
            let ghost = anra.FigureUtil.createGhostFigure(linePart);
            //实际
            ghost.model = linePart.model;
            return ghost;
            }),
            targetLineGhost = editPart.tConns.map(linePart => {
                let ghost =  anra.FigureUtil.createGhostFigure(linePart);
                ghost.model = linePart.model;
                return ghost;
            });

        return {
            node: nodeGhost,
            sourceLines: sourceLineGhost,
            targetLines: targetLineGhost,
        }
    }
};

anra.NORTH = "n";
anra.SOUTH = "s";
anra.EAST = "e";
anra.WEST = "w";
anra.CENTER = "c";
anra.NORTH_EAST = "ne";
anra.NORTH_WEST = "nw";
anra.SOUTH_EAST = "se";
anra.SOUTH_WEST = "sw";


anra.addExtend = function (path) {
    require(path);

    return anra;
}

export {anra}