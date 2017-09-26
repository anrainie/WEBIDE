import {$AG, anra, constants} from "anrajs";

export let cwf = $AG.Editor.extend({
    constructor(config) {
        $AG.Editor.prototype.constructor.call(this, config);
        this.rootEditPart.setLayout(new $AG.Layout.GRID({
            numColumns: 1,
            makeColumnsEqualWidth: true,
            makeRowsEqualHeight: false,
            autoAdapt: true,
            horizontalAutoAdapt: true,
            verticalAutoAdapt: false
        }));
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

        if (this.getHost().config.children[type]) {
            this.showLayoutTargetFeedback(request);
        } else {
            this.getHost().figure.setStyle({
                cursor: "not-allowed"
            });
        }
    },

    showTargetFeedback: function (request) {
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
anra.gef.DragTracker = anra.gef.RootDragTracker.extend({

    mouseDrag: function (me, editPart) {

        //这里需要mouseOnTarget触发的事件,若dragTarget与mouseOnTarget一致交给父级处理

        /*dragTarget与mouseOnTarget不同*/
        if (me.prop.drag !== me.prop.target) {

            /*过滤dragTarget触发的事件*/
            if (editPart.figure === me.prop.drag) return true;

            /*下面是必是mouseOnTarget触发的事件 */
            let policy = editPart.getLayoutPolicy();

            if (policy == null) return false;

            if (this.policy == null) this.policy = policy;

            if (this.policy !== policy) {
                console.log('erase')
                this.policy.eraseTargetFeedback({
                   type: constants.REQ_MOVE
                });
            }

            editPart.showTargetFeedback({
                editPart: editPart,
                target: me.prop.drag,
                event: me,
                type: constants.REQ_MOVE
            });
            return true;
        }


        if (editPart.figure !== me.prop.drag) {
            let policy = editPart.getLayoutPolicy();

            if (policy == null) return false;

            if (this.policy ==null) this.policy = policy;

            if (this.policy !== policy) {
                console.log('xxx')
                this.policy.eraseTargetFeedback({
                    type: constants.REQ_MOVE
                });
            }

            editPart.showTargetFeedback({
                editPart: editPart,
                target: me.prop.drag,
                event: me,
                type: constants.REQ_MOVE
            });
            return true;
        }

        return false;
    },

    dragStart: function (me, editPart) {

        /*找到父级的DragTracker*/
        if (editPart.figure !== me.prop.drag) {
            let policy = editPart.getLayoutPolicy();

            if (policy) {
                editPart.showTargetFeedback({
                    editPart: editPart,
                    target: me.prop.drag,
                    event: me,
                    type: constants.REQ_DRAG_START
                });

                return true
            }
        }

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
