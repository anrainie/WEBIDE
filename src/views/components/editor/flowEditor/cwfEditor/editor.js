import {$AG, anra, constants} from "anrajs";

export let cwf = $AG.Editor.extend({
    constructor(config) {
        $AG.Editor.prototype.constructor.call(this, config);
        var layoutManager = new $AG.Layout.GRID({
            numColumns: 1,
            makeColumnsEqualWidth: true,
            makeRowsEqualHeight: false,
            horizontalAutoAdapt: false,
            verticalAutoAdapt: false,
            horizontalExpand: true,
            verticalExpand: false,
            marginTop: 20
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
        let s = LayoutPolicy.extend(layoutSequencePolicy);
        //this.put(anra.gef.LAYOUT_POLICY, new LayoutPolicy());
        //this.put("ggg", new layoutSequencePolicy())
        this.put(anra.gef.LAYOUT_POLICY, new s());
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

        //TODO
        if (editParts instanceof Array) return;

        if (editParts) {
            var type = editParts.model.get('type');

            if (this.getHost().config.children[type] == null) {
                this.getHost().figure.setStyle({
                    cursor: "not-allowed"
                });
            }
            this.showLayoutTargetFeedback(request);
        }
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

var containerLayoutPolicy = LayoutPolicy.extend({
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


/*在grid的布局的情况下，提示布局的位置和决定布局位置*/
let layoutSequencePolicy = {
    showRedLineFeedback(req) {
        this.refreshRedLine(this.getRedLineVisual(), req.event);
    },
    showTargetFeedback(req) {
        LayoutPolicy.prototype.showTargetFeedback.call(this, req);
        this.showRedLineFeedback(req);
    },
    eraseTargetFeedback(req) {
        LayoutPolicy.prototype.eraseTargetFeedback.call(this, req);
        this.eraseRedLineFeedback(this.getRedLineVisual());
    },
    eraseRedLineFeedback(req) {
        this.removeFeedback(this.getRedLineVisual());
        this.["redLine"] = null;
    },
    getRedLineVisual() {
        if (this["redLine"] == null) {
            let lineClass = anra.svg.Control.extend(anra.svg.Line), redLine;
            this["redLine"] = redLine = new lineClass();

            redLine.disableEvent();
            redLine.setAttribute({
                stroke: 'red',
                fill: 'red',
                "stroke-width": 2
            });

            this.addFeedback(redLine);
        }

        return this["redLine"];
    },
    refreshRedLine(line, e) {
        let editPart = this.getHost();

        /*如果当前节点不能添加子节点，交给父级处理*/
        while (!this.canAddChild(editPart) && editPart.parent) {
            editPart = editPart.parent;
        }

        if (editPart) {
            if (this["compute" + editPart.model.get("type")])
                this["compute" + editPart.model.get("type")](line, e, editPart);
            else if (editPart instanceof anra.gef.RootEditPart)
                this["compute" + "root"](line, e, editPart)
            else {
                //TODO 警告
            }
        }
    },
    canAddChild(editPart) {
        return editPart["config"]
            || editPart["config"]["children"]
            || editPart["config"]["children"].length > 0;
    },
    ['compute' + 'switch'](line, event, editPart) {
        this.computeVertical(line, event, editPart);
    },
    ['compute' + 'if'](line, event, editPart) {
        this.computeVertical(line, event, editPart);
    },
    ['compute' + 'defualt'](line, event, editPart) {
        this.computeVertical(line, event, editPart);
    },
    ['compute' + 'for'](line, event, editPart) {
        this.computeVertical(line, event, editPart);
    },
    ['compute' + 'while'](line, event, editPart) {
        this.computeVertical(line, event, editPart);
    },
    ['compute' + 'sql'](line, event, editPart) {
        this.computeVertical(line, event, editPart);
    },
    ['compute' + 'root'](line, event, editPart) {
        let layer = editPart.getPrimaryLayer(), bounds = layer.getClientArea(), children = layer.children;

        let length = 120;

        if (children == null || children.length == 0) {
            line.setBounds({
                x: (bounds[2] - length)/2,
                y: bounds[3]/2,
                width: (bounds[2] + length)/2,
                height: bounds[3]/2
            });
        } else {
            let y = event.y, pos = children[0].getClientArea()[1], min = Math.abs(y - pos),
                currentPos, offset;

            children.reduce((pre, next) => {
                currentPos = (pre.getClientArea()[1] + pre.getClientArea()[3] + next.getClientArea()[1]) / 2;
                offset = Math.abs(y - currentPos);
                if (offset < min) {
                    pos = currentPos;
                    min = offset;
                }
            });

            let lastBounds = children[children.length - 1].getClientArea();

            currentPos = lastBounds[1] + lastBounds[3];
            pos = Math.abs(currentPos - y) < min ? currentPos : pos;

            line.setBounds({
                x: (bounds[2]- length)/2,
                y: currentPos,
                width: (bounds[3] + length)/2,
                height: currentPos
            });
        }

        editPart.getRoot().getFeedbackLayer().addChild(line);
    },
    computeVertical(line, event, editPart) {
        let y = event.y,
            currentFigure = editPart.figure,
            children = currentFigure.children,
            bounds = currentFigure.getClientArea();

        let pos = bounds[1] + bounds[3], min = Math.abs(y - pos);

        if (children) {
            let currentPos, lastBottom, offset

            children.forEach((child, index) => {
                currentPos = index == 0 ? child.getClientArea()[1] - 5 : (lastBottom + child.getClientArea()[1])/2;
                lastBottom = this.getBottom(child.getClientArea());
                offset = Math.abs(y - currentPos);

                if (offset < min) {
                    pos = currentPos;
                    min = offset;
                }
            });
        }

        let length = 120, start = bounds[0] + (bounds[2] - length)/2;

        line.setBounds({
            x: start,
            y: pos,
            width: start + length,
            height: pos
        });
    },
    computeHorizontal(line, event, editPart) {
        //这里暂时认为switch的布局，两者需要对应

        //默认为格子，不做验证
        let layout = editPart.figure.layoutManager,
            //布局参数
            {numColumns, numRows, marginLeft, marginTop, marginRight, marginBottom,horizontalSpacing,
                verticalSpacing} =  layout.argumentData,

            children = editPart.figure.children,
            bounds = editPart.figure.getClientArea(),
            {x, y} = event;

        let startX, startY, length = 120;

        if (children == null || children.length == 0) {
            startX = bounds[0] + marginLeft;
            startY = bounds[1] + marginTop;
        } else {
            let i, pos, currentPos, min, offset;

            //确定Y
            pos = bounds[1] + bounds[3] - marginBottom - length;
            while (i < numRows) {
                currentPos = this.getBottom(children[i].getClientArea());

                if (currentPos > y) {
                    pos = currentPos - length;

                    break;
                }

                i += numColumns;
            }
            startY = pos;

            //确定X
            pos = bounds[0] + marginLeft;
            min = Math.abs(x - pos);
            for (let j = 0; j < 4; j++) {
                if (children[i + j] == null)
                    break;

                currentPos = this.getLeft(children[i + j].getClientArea()) + horizontalSpacing/2;
                offset = Math.abs(currentPos - x);

                if (offset < min) {
                    min = offset;
                    pos = currentPos;
                }
            }
            startX = pos;
        }

        line.setBounds({
            x: startX,
            y: startY,
            width: startX,
            height: startY + length
        });

    },
    getBottom(bounds) {
        return bounds[1] + bounds[3];
    },
    getLeft(bounds) {
        return bounds[0] + bounds[2];
    }
}

export let ContainerLayoutPolicy = containerLayoutPolicy.extend(layoutSequencePolicy);
