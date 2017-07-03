/**
 * Created with JetBrains WebStorm.
 * User: Caiyu
 * Date: 16-7-20
 * Time: 上午9:45
 */
import {anra} from './anra.gef'
import Base from '../lib/Base'
import {Map, Util} from './anra.common'
import * as constants from './anra.constants'

anra.addExtend('./anra.handle')

anra.gef.AbstractEditPolicy = anra.gef.Policy.extend({});


/**
 * 连线模式策略，展示选中线的可拖拽点，展示所有节点的可连接点，只能安装在RootEditPart上
 * @type {*}
 */
anra.gef.LinkModPolicy = anra.gef.Policy.extend({

    /**
     * 激活连线模式，展示相关UI
     */
    showSourceFeedback: function (req) {

        if (constants.REQ_CONNECTION_MOD == req.type) {
            /*遍历所有子EditPart，展示可连接点UI，由于每个节点的性质不一样，可连接点的样式由各个节点自己负责*/
            var editParts = this.getHost().children;
            var childPolicy;
            if (editParts != null)
                for (var i = 0; i < editParts.length; i++) {
                    childPolicy = editParts[i].getConnectionPolicy();
                    childPolicy && childPolicy.showSourceFeedback(req);
                }
        }
    },
    /**
     * 反激活连线模式，消除相关UI
     */
    eraseSourceFeedback: function (req) {
        if (constants.REQ_CONNECTION_MOD == req.type) {
            var editParts = this.getHost().children;
            var childPolicy;
            if (editParts != null)
                for (var i = 0; i < editParts.length; i++) {
                    childPolicy = editParts[i].getConnectionPolicy();
                    childPolicy && childPolicy.eraseSourceFeedback(req);
                }
        }
    }

});

/**
 * 布局策略，决定了拖拽节点的样式和结果，只能安装在RootEditPart上
 * @type {*}
 */
anra.gef.LayoutPolicy = anra.gef.AbstractEditPolicy.extend({
    sizeOnDropFeedback: null,
    ID: 'layoutPolicy',
    listener: null,
    feedbackMap: null,
    constructor: function () {
        this.feedbackMap = new Map();
    },
    refreshFeedback: function (feedback, request, offsetX, offsetY) {
        if (feedback != null) {
            feedback.setBounds({
                x: request.event.x + (offsetX == null ? 0 : offsetX),
                y: request.event.y + (offsetY == null ? 0 : offsetY)
            });
        }
    },
    activate: function () {
        this.setListener(this.createListener());
        this.decorateChildren();
    },
    createChildEditPolicy: function (child) {
        //TODO
    },
    eraseLayoutTargetFeedback: function (request) {
        //TODO
        this.editParts = null;
        var values = this.feedbackMap.values();
        for (var i = 0, len = values.length; i < len; i++) {
            this.removeFeedback(values[i]);
        }
        this.feedbackMap.clear();
    },
    getAddCommand: function (request) {
        return null;
    },
    getCloneCommand: function (request) {
        return null;
    },
    showLayoutTargetFeedback: function (request) {
        var feedback;
        var editParts = this.editParts = this.getLayoutEditParts(request);
        if (editParts instanceof Array) {
            var ox = request.target.bounds.x,
                oy = request.target.bounds.y;
            for (var i = 0, len = editParts.length; i < len; i++) {
                feedback = this.getFeedback(editParts[i]);
                this.refreshFeedback(feedback, request, editParts[i].figure.bounds.x - ox, editParts[i].figure.bounds.y - oy);
            }
        } else if (editParts instanceof anra.gef.NodeEditPart) {
            feedback = this.getFeedback(editParts);
            this.refreshFeedback(feedback, request);
        }
    },
    getLayoutEditParts: function (request) {
        if (constants.REQ_CREATE == request.type) {
            var creationTool = request.target;
            return creationTool.getEditPart(this.getHost());
        } else if (constants.REQ_MOVE == request.type) {
//            if (request.target.model instanceof anra.gef.NodeModel) {
            var selection = this.getHost().getRoot().selection;
            if (selection == null)return null;
            if (selection.figure == request.target)
                return selection;
            /*验证已选节点里包含拖拽目标节点*/
            if (selection instanceof Array) {
                var s = [];
                var valid;
                for (var i = 0, len = selection.length; i < len; i++) {
                    if (selection[i].figure == request.target) {
                        Util.insert.call(s, selection[i]);
                        valid = true;
                    } else {
                        s.push(selection[i]);
                    }
                }
                if (valid)return s;
            }
//            }
        }
        return null;
    },
    getFeedback: function (ep) {
        var ghost = this.feedbackMap.get(ep.model);
        if (ghost == null) {
            ghost = this.createFeedback(ep);

            this.addFeedback(ghost);
            this.feedbackMap.put(ep.model, ghost);

            if (this.mouseUpListener == null) {
                var p = this;
                p.mouseUpListener = function (e) {
                    p.eraseLayoutTargetFeedback();
                    anra.Platform.getDisplay().off(anra.EVENT.MouseUp, p.mouseUpListener);
                    p.mouseUpListener = null;
                };
                anra.Platform.getDisplay().on(anra.EVENT.MouseUp, p.mouseUpListener);
            }
        }
        return ghost;
    },
    createFeedback: function (ep) {
        return anra.FigureUtil.createGhostFigure(ep);
    },
    getMoveChildrenCommand: function (request) {
        //TODO
    },
    getOrphanChildrenCommand: function (request) {
        return null;
    },
    getDeleteDependantCommand: function (request) {
        return null;
    },
    getMoveCommand: function (request) {
        var target = this.editParts;
        if (target instanceof anra.gef.NodeEditPart && target.dragTracker)
            return this.movecmd(target, request);
        else if (target instanceof Array) {
            var cmd, offx, offy, ox, oy;
            if (request.target.bounds == null) {
                ox = 0;
                oy = 0
            } else
                ox = request.target.bounds.x,
                    oy = request.target.bounds.y;
            for (var i = 0; i < target.length; i++) {
                if (target[i].dragTracker == null)return null;
                offx = target[i].figure.bounds.x - ox;
                offy = target[i].figure.bounds.y - oy;
                cmd = cmd == null ?
                    this.movecmd(target[i], request, offx, offy) :
                    cmd.chain(this.movecmd(target[i], request, offx, offy));
            }
            return cmd;
        }
    },
    movecmd: function (target, request, offx, offy) {
        return new anra.gef.RelocalCommand(target, {
                x: target.getFigure().getBounds().x,
                y: target.getFigure().getBounds().y
            },
            {
                x: request.event.x + (offx ? offx : 0),
                y: request.event.y + (offy ? offy : 0)
            });
    },
    getCreateCommand: function (request) {
        var model = request.event.prop.drag.model;
        var b = model.get('bounds');
        model.set('bounds', [request.event.x - b[2] / 2, request.event.y - b[3] / 2, b[2], b[3]]);
        return new anra.gef.CreateNodeCommand(this.getHost().getRoot(), model);
    },
    createListener: function () {
        var listener = new anra.gef.EditPartListener();
        var f = this;
        listener.childAdded = function (child, index) {
            f.decorateChild(child);
        };
        return listener;
    },
    deactivate: function () {
        if (this.sizeOnDropFeedback != null) {
            this.removeFeedback(this.sizeOnDropFeedback);
            this.sizeOnDropFeedback = null;
        }
        this.setListener(null);
    },
    decorateChild: function (child) {
        var policy = this.createChildEditPolicy(child);
        if (policy != null)
            child.installEditPolicy(anra.gef.Policy.PRIMARY_DRAG_ROLE, policy);
    },
    decorateChildren: function () {
        var children = this.getHost().children;
        for (var i = 0, len = children.length; i < len; i++)
            this.decorateChild(children[i]);
    },
    eraseTargetFeedback: function (request) {
        if (constants.REQ_ADD == request.type
            || constants.REQ_MOVE == request.type
            || constants.REQ_RESIZE_CHILDREN == request.type
            || constants.REQ_CREATE == request.type
            || constants.REQ_CLONE == request.type)
            this.eraseLayoutTargetFeedback(request);

        if (constants.REQ_CREATE == request.type)
            this.eraseSizeOnDropFeedback(request);
    },
    getCommand: function (request) {
        if (constants.REQ_DELETE_DEPENDANT == request.type)
            return this.getDeleteDependantCommand(request);
        if (constants.REQ_ADD == request.type)
            return this.getAddCommand(request);
        if (constants.REQ_ORPHAN_CHILDREN == request.type)
            return this.getOrphanChildrenCommand(request);
        if (constants.REQ_MOVE_CHILDREN == request.type)
            return this.getMoveChildrenCommand(request);
        if (constants.REQ_MOVE == request.type)
            return this.getMoveCommand(request);
        if (constants.REQ_CLONE == request.type)
            return this.getCloneCommand(request);
        if (constants.REQ_CREATE == request.type)
            return this.getCreateCommand(request);
        return null;
    },
    getLayoutContainer: function () {
        return this.getHostFigure();
    },
    showSizeOnDropFeedback: function (request) {
    },
    eraseSizeOnDropFeedback: function (request) {
        if (this.sizeOnDropFeedback != null) {
            this.removeFeedback(this.sizeOnDropFeedback);
            this.sizeOnDropFeedback = null;
        }
    },
    createSizeOnDropFeedback: function (createRequest) {
//        var shadow = anra.FigureUtil.createGhostFigure(this.getHost());
//        this.addFeedback(shadow);
        return null;
    },
    getSizeOnDropFeedback: function (createRequest) {
        if (createRequest != null) {
            if (this.sizeOnDropFeedback == null)
                this.sizeOnDropFeedback = this.createSizeOnDropFeedback(createRequest);
            return this.sizeOnDropFeedback;
        }
    },
    getTargetEditPart: function (request) {
        if (constants.REQ_ADD == request.type
            || constants.REQ_MOVE == request.type
            || constants.REQ_CREATE == request.type
            || constants.REQ_CLONE == request.type)
            return this.getHost();
        return null;
    },
    setListener: function (listener) {
        if (this.listener != null)
            this.getHost().removeEditPartListener(this.listener);
        this.listener = listener;
        if (this.listener != null)
            this.getHost().addEditPartListener(this.listener);
    },
    showTargetFeedback: function (request) {
        if (constants.REQ_ADD == request.type
            || constants.REQ_CLONE == request.type
            || constants.REQ_MOVE == request.type
            || constants.REQ_RESIZE_CHILDREN == request.type
            || constants.REQ_CREATE == request.type)
            this.showLayoutTargetFeedback(request);

        if (constants.REQ_CREATE == request.type) {
//            if (request.getSize() != null) {
            this.showSizeOnDropFeedback(request);
//            }
        }
    },
    undecorateChild: function (child) {
        child.removeEditPolicy(anra.gef.Policy.PRIMARY_DRAG_ROLE);
    },
    undecorateChildren: function () {
        var children = this.getHost().children;
        for (var i = 0; i < children.length; i++)
            this.undecorateChild(children[i]);
    }
});

anra.gef.ConnectionPolicy = anra.gef.AbstractEditPolicy.extend({
    showAnchors: function () {
        if (this.anchorHandles == null)
            this.anchorHandles = [];
        var anchors = this.getHost().getAnchors();
        if (anchors != null)
            for (var i = 0; i < anchors.length; i++) {
                var h = this.createAttarchHandle(anchors[i]);
                this.anchorHandles.push(h);
                this.addHandle(h);
            }
    },
    eraseAnchors: function () {
        if (this.anchorHandles != null) {
            for (var i = 0; i < this.anchorHandles.length; i++) {
                this.removeHandle(this.anchorHandles[i]);
            }
            this.anchorHandles = null;
        }
    },
    createAttarchHandle: function (anchor) {
        if (anchor == null)return null;
        var handle = anra.Handle.extend(anra.svg.Circle);
        handle = new handle(this.getHost());
        handle.setBounds({
            x: anchor.x,
            y: anchor.y,
            width: 5
        }, true);
        handle.setAttribute({
            fill: 'blue'
        });
        handle.setOpacity(0.5);
        return handle;
    },
    showSourceFeedback: function (req) {
        if (constants.REQ_CONNECTION_START == req.type || constants.REQ_RECONNECT_SOURCE == req.type) {
            var anchor = this.getHost().getSourceAnchor(req);
            this.refreshSourceAnchorFeedback(anchor);
        } else if (constants.REQ_CONNECTION_MOD == req.type) {
            this.showAnchors(req);
        }
    },
    eraseSourceFeedback: function (req) {
        if (constants.REQ_CONNECTION_MOD == req.type) {
            this.eraseAnchors(req);
        }
        if (this.sourceAnchor != null) {
            this.getFeedbackLayer().removeChild(this.sourceAnchor);
            this.sourceAnchor = null;
        }
    },
    showTargetFeedback: function (req) {
        if (constants.REQ_RECONNECT_TARGET == req.type || constants.REQ_CONNECTION_END == req.type) {
            var anchor = this.getHost().getTargetAnchor(req);
            this.refreshTargetAnchorFeedback(anchor);
        }
    },
    eraseTargetFeedback: function (req) {
        if (anra.gef.ConnectionPolicy.targetAnchorFeedback != null) {
            this.removeFeedback(anra.gef.ConnectionPolicy.targetAnchorFeedback);
            anra.gef.ConnectionPolicy.targetAnchorFeedback = null;
        }
    },
    refreshTargetAnchorFeedback: function (anchor) {
        if (anra.gef.ConnectionPolicy.targetAnchorFeedback == null) {
            anra.gef.ConnectionPolicy.targetAnchorFeedback = this.createTargetAnchorFeedback();
            this.addFeedback(anra.gef.ConnectionPolicy.targetAnchorFeedback);
        }
        anra.gef.ConnectionPolicy.targetAnchorFeedback.setBounds({x: anchor.x, y: anchor.y, width: 10, height: 10});
    },
    refreshSourceAnchorFeedback: function (anchor) {
        if (this.sourceAnchor == null) {
            this.sourceAnchor = this.createSourceAnchorFeedback();
            this.getFeedbackLayer().addChild(this.sourceAnchor);
        }
        
        if (anchor) {        
            this.sourceAnchor.setBounds({x: anchor.x, y: anchor.y, width: 10, height: 10});
        }
    },
    createSourceAnchorFeedback: function () {
        var Circle = anra.svg.Control.extend(anra.svg.Circle);
        Circle = new Circle();
        Circle.setAttribute({
            fill: 'red'
        });
        Circle.setOpacity(0.5);
        return Circle;
    },
    createTargetAnchorFeedback: function () {
        var Rect = anra.svg.Control.extend(anra.svg.Circle);
        Rect = new Rect();
        Rect.setAttribute({
            stroke: 'yellow'
        });
        Rect.setOpacity(0.5);
        return Rect;
    },
    getCommand: function (req) {
        if (req.type == constants.REQ_RECONNECT_TARGET) {
            return this.getReconnectTargetCommand(req);
        } else if (req.type == constants.REQ_RECONNECT_SOURCE) {
            return this.getReconnectSourceCommand(req);
        } else if (req.type == constants.REQ_CONNECTION_START) {
            return this.getCreateConnectionCommand(req);
        } else if (req.type == constants.REQ_CONNECTION_END) {
            return this.getConnectionCompleteCommand(req);
        }
    },
    getReconnectTargetCommand: function (req) {
        var cmd = new anra.gef.ReconnectTargetCommand();
        cmd.line = req.line;
        cmd.terminal = req.anchor.id;
        cmd.target = this.getHost();
        return cmd;
    },
    getReconnectSourceCommand: function (req) {
        var cmd = new anra.gef.ReconnectSourceCommand();
        cmd.line = req.line;
        cmd.terminal = req.anchor.id;
        cmd.source = this.getHost();
        return cmd;
    },
    getCreateConnectionCommand: function (req) {
        var cmd = new anra.gef.CreateLineCommand();
        cmd.line = new anra.gef.LineModel();
        if (req.model)
            cmd.line.setValues(req.model.props);
        cmd.line.set('id', anra.genUUID());
        cmd.line.set('exit', req.anchor.id);
        cmd.rootEditPart = this.getHost().getRoot();
        cmd.sourceId = this.getHost().model.get('id');
        return cmd;
    },
    getConnectionCompleteCommand: function (req) {
        var cmd = req.command;
        if (cmd == null)return null;
        cmd.targetId = this.getHost().model.get('id');
        cmd.line.set('entr', req.anchor.id);
        return cmd;
    }
});

/**
 * 选中节点策略
 * @type {*}
 */
anra.gef.SelectionPolicy = anra.gef.AbstractEditPolicy.extend({
    handles: [],
    class:'selection policy',
    selectionListener: null,
    activate: function () {
        this.addSelectionListener();
    },
    deactivate: function () {
        this.removeSelectionHandles();
        this.removeSelectionListener();
    },
    validatePolicy: function () {
        if (this.handles.length > 0) {
            for (var i = 0; i < this.handles.length; i++) {
                this.handles[i].refreshLocation(this.getHostFigure());
            }
        }
    },
    addSelectionListener: function () {
        var policy = this;
        var SelectionEditPartListener = anra.gef.EditPartListener.extend({
            selectedStateChanged: function (editPart) {
                switch (editPart.getSelected()) {
                    case constants.SELECTED_NONE:
                        policy.hideSelection();
                        policy.unselected(editPart);
                        break;
                    case constants.SELECTED:
                    case constants.SELECTED_PRIMARY:
                        policy.showPrimarySelection();
                        policy.selected(editPart);
                        break;
                    default :
                }
            }
        });
        this.selectionListener = new SelectionEditPartListener();
        this.getHost().addEditPartListener(this.selectionListener);
    },
    unselected: function (editPart) {
    },
    selected: function (editPart) {
    },
    removeSelectionListener: function () {
        this.getHost().removeEditPartListener(this.selectionListener);
    },
    showPrimarySelection: function () {
        if (this.handles == null || Util.isEmpty.call(this.handles))
            this.addSelectionHandles();
        else {
            for (var i = 0; i < this.handles.length; i++) {
                this.handles[i].setVisible(true);
            }
        }
    },
    hideSelection: function () {
        if (this.handles == null || Util.isEmpty.call(this.handles)) {
            return;
        }
        for (var i = 0; i < this.handles.length; i++) {
            this.handles[i].setVisible(false);
        }
    },
    addSelectionHandles: function () {
        this.removeSelectionHandles();
        this.handles = this.createSelectionHandles();
        if (this.handles != null)
            for (var i = 0; i < this.handles.length; i++) {
                this.getHandleLayer().addChild(this.handles[i]);
            }
    },
    removeSelectionHandles: function () {
        if (Util.isEmpty.call(this.handles)) {
            return;
        }
        if (this.handles != null)
            for (var i = 0; i < this.handles.length; i++) {
                this.getHandleLayer().removeChild(this.handles[i]);
            }
        this.handles = [];
    },
    createSelectionHandles: function (selection) {
        return [];
    }
});

anra.gef.LineSelectionPolicy = anra.gef.SelectionPolicy.extend({
//    showPrimarySelection:function (selection) {
//        anra.gef.SelectionPolicy.prototype.showPrimarySelection.call(this, selection);
//        this.getHost().getRoot().  editor.setActiveTool(new anra.gef.LinkLineTool());
//    },
//    hideSelection:function(selection){
//        anra.gef.SelectionPolicy.prototype.hideSelection.call(this, selection);
//        console.log(selection)
//    },
    unselected: function (editPart) {
        this.getHostFigure().setStyle({
            stroke: this.color,
            'stroke-width': this.sw
        });
    },
    selected: function (editPart) {
        this.color = this.getHostFigure().getStyle('storke');
        if(this.color==null)
            this.color=this.getHostFigure().attr['storke'];
        this.sw = this.getHostFigure().getStyle('storke-width');
        this.getHostFigure().setStyle('stroke', 'blue');
    },
    createSelectionHandles: function (selection) {
        return [new anra.gef.LineHandle(this.getHost(), constants.REQ_RECONNECT_SOURCE), new anra.gef.LineHandle(this.getHost(), constants.REQ_RECONNECT_TARGET)];
    }
});

anra.gef.ResizableEditPolicy = anra.gef.SelectionPolicy.extend({
    class:'resize policy',
    createSelectionHandles: function () {
        var handles = [];
        var editPart = this.getHost();
        handles.push(new anra.ResizeHandle(editPart, anra.NORTH));
        handles.push(new anra.ResizeHandle(editPart, anra.SOUTH));
        handles.push(new anra.ResizeHandle(editPart, anra.EAST));
        handles.push(new anra.ResizeHandle(editPart, anra.WEST));
        handles.push(new anra.ResizeHandle(editPart, anra.NORTH_EAST));
        handles.push(new anra.ResizeHandle(editPart, anra.NORTH_WEST));
        handles.push(new anra.ResizeHandle(editPart, anra.SOUTH_EAST));
        handles.push(new anra.ResizeHandle(editPart, anra.SOUTH_WEST));
        return handles;
    }

});

//anra.gef.CreateLinePolicy= anra.gef.

anra.gef.Policy.PRIMARY_DRAG_ROLE = "PrimaryDrag Policy";

export {anra}