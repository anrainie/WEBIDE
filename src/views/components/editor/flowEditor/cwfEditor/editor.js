import {$AG, anra, constants} from "anrajs";

export let cwf = $AG.Editor.extend({
    constructor(config) {
        $AG.Editor.prototype.constructor.call(this, config);
        var layoutManager = new $AG.Layout.GRID({
            numColumns: 1,
            makeColumnsEqualWidth: true,
            makeRowsEqualHeight: false,
            autoAdapt: true,
            horizontalAutoAdapt: true,
            verticalAutoAdapt: false
        });
        layoutManager.setLayoutData({
            verticalAlignment: "center",
            horizontalAlignment: "center"
        });
        this.rootEditPart.setLayout(layoutManager);
    },
    createCanvas(id) {
        var canvas = $AG.Editor.prototype.createCanvas.call(this, id);

        canvas.owner.style.width = "100%";

        return canvas;
    },
    getCustomPolicies: function () {
        this.put(anra.gef.LAYOUT_POLICY, new LayoutPolicy());
    }
});


let LayoutPolicy = anra.gef.LayoutPolicy.extend({

    eraseLayoutTargetFeedback(request) {
        //TODO
        this.getHost().figure.setStyle({
            cursor: "auto"
        });
        this.editParts = null;
        var values = this.feedbackMap.values();
        for (var i = 0, len = values.length; i < len; i++) {
            this.removeFeedback(values[i]);
        }
        this.feedbackMap.clear();
    },

    showCreateTargetFeedback(request) {
        var editParts = this.editParts = this.getLayoutEditParts(request);

        if (editParts == null) {
            this.getHost().figure.setStyle({
                cursor: "not-allowed"
            });
        } else {
            this.showLayoutTargetFeedback(request);
        }
    },

    showMoveTargetFeedback(request) {
        var editParts = this.editParts = this.getLayoutEditParts(request);

        if (editParts instanceof Array) return;

        var type = editParts.model.get('type');

        if (this.getHost().config.children[type] == null) {
            this.getHost().figure.setStyle({
                cursor: "not-allowed"
            });
        }
        this.showLayoutTargetFeedback(request);
    },

    showTargetFeedback(request) {
        if (constants.REQ_ADD == request.type
            || constants.REQ_CLONE == request.type
            || constants.REQ_RESIZE_CHILDREN == request.type)
            this.showLayoutTargetFeedback(request);

        if (constants.REQ_MOVE == request.type
            || constants.REQ_DRAG_START == request.type)
            this.showMoveTargetFeedback(request)

        if (constants.REQ_CREATE == request.type) {
            this.showCreateTargetFeedback(request)
            this.showSizeOnDropFeedback(request);
        }
    },

    getMoveCommand(request) {
        let target = this.editParts, host = this.getHost();

        if (target instanceof anra.gef.NodeEditPart && target.dragTracker) {
            let model = target.model;

            /*判断鼠标状态和父子级关系，确保可以返回命令*/
            if (host.figure.getStyle("cursor") != "not-allowed" && host.config.children[model.get('type')]) {
                /**/
                let feedback = this.getFeedback(target);

                /*在父节点中*/
                if (target.parent === host) {
                    return this.movecmd(target, request, feedback.offsetX, feedback.offsetY);
                }
                else {
                    let x = request.event.x + feedback.offsetX,
                        y =  request.event.y + feedback.offsetY
                    if (!(host instanceof anra.gef.RootEditPart)) {
                        x -= host.getFigure().getAttr('x', parseFloat)
                        y -= host.getFigure().getAttr('y', parseFloat)
                    }

                    model.set('bounds', [x, y, model.get('bounds')[2], model.get('bounds')[3]])

                    return (new anra.gef.DeleteNodeCommand(target.parent, target))
                        .chain(new anra.gef.CreateNodeCommand(host, model));
                }

            }
        }
    }
});

export var ContainerLayoutPolicy = LayoutPolicy.extend({
    ID: 'ContainerLayoutPolicy',
    createFeedback(ep) {
        var f = anra.FigureUtil.createGhostFigure(ep);
        var b = f.bounds;
        f.bounds = {width: b.width / 2, height: b.height / 2};
        return f;
    },
    getCreateCommand(request) {
        var model = request.event.prop.drag.model,
            type = model.get('type'),
            b = model.get('bounds'), parent = request.editPart;

        while (parent && (parent.config.children == null || parent.config.children[type] == null)) {
            parent = parent.parent;
        }

        if (parent == null) {
            return null;
        }

        var pb = parent instanceof anra.gef.RootEditPart ? [0, 0] : parent.model.get('bounds');

        model.set('bounds', [request.event.x - pb[0], request.event.y - pb[1], b[2], b[3]]);
        return new anra.gef.CreateNodeCommand(this.getHost(), model);
    }
});

class DragTracker {

    mouseDrag (me, editPart) {

        let req = {
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_MOVE
        };

        /*用dragTarget的dragTrack记录mouseOnTarget,要求保证每次mouseOnTarget变换的时候，能够消除上一次的feedback*/
        if (editPart.figure === me.prop.drag && this['target'] !== me.prop.target && this["policy"]) {
            this["policy"].eraseTargetFeedback(req);
            me.offsetX = this.offsetX;
            me.offsetY = this.offsetY;
            me.dragTracker = this;
        }

        //若dragTarget与mouseOnTarget一致交给父级处理,其他交给mouseOnTarget处理
        if (me.prop.drag === me.prop.target ) {
            /*必是dragTarget触发, 确保不是dragTarget本身的LayoutPolicy处理*/

            if (me.prop.drag === editPart.figure) return false;

            if (editPart.getLayoutPolicy()) {

                if (me.dragTracker) {
                    me.dragTracker.policy = editPart.getLayoutPolicy();
                    me.dragTracker.target = me.prop.target;
                }

                editPart.showTargetFeedback(req);

                return true;
            }

            return false;
        }

        /*若dragTarget和mouseOnTarget不是同一个,分别会触发两次*/

        /*不需要dragTarget触发的,因为需要只需要mouseOnTarget的LayoutPolicy*/
        if (me.prop.drag === editPart.figure) return true;

        if (editPart.getLayoutPolicy()) {

            if (me.dragTracker) {
                me.dragTracker.policy = editPart.getLayoutPolicy();
                me.dragTracker.target = me.prop.target;
            }

            editPart.showTargetFeedback(req);

            return true;
        }

        return false;
    }

    dragStart (me, editPart) {

        /*找到父级的DragTracker*/
        if (editPart.figure !== me.prop.drag) {
            let policy = editPart.getLayoutPolicy();

            if (policy) {
                me.dragTracker.policy = policy;
                me.dragTracker.target = me.prop.target;

                editPart.showTargetFeedback({
                    editPart: editPart,
                    target: me.prop.drag,
                    event: me,
                    type: constants.REQ_DRAG_START
                });

                return true
            }
        } else {
            me.dragTracker = this;
        }

        var bounds = editPart.figure.getClientArea();
        this.offsetX = me.offsetX = bounds[0] - me.x;
        this.offsetY = me.offsetY = bounds[1] - me.y;

        return false;
    }

    dragEnd (me, editPart) {

        /*如果mouseOnTarget是dragTarget本身，则交给父级处理*/
        if (me.prop.drag === editPart.figure) return false;

        let req = {
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_MOVE
        };

        var cmd = editPart.getCommand(req);

        if (cmd) editPart.getRoot().editor.execute(cmd);

        /*若show的policy与此时不一致*/
        editPart.eraseTargetFeedback(req);

        return cmd && cmd.canExecute();
    }

    mouseDown (me, editPart) {
    }
}

anra.gef.DragTracker = anra.gef.RootDragTracker = DragTracker;
