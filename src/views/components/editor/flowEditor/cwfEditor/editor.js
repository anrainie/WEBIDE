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
        this.put(anra.gef.LAYOUT_POLICY, new layoutPolicy());
    }
});

/*新建一个在拖拽过程中可以变换父子节点的dragTracker*/
class dragTracker {
    dragStart(me, editPart) {
        editPart.showTargetFeedback({
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_DRAG_START
        });
    }

    mouseDrag(me, editPart) {
        /*区别于REQ_MOVE*/
        editPart.showTargetFeedback({
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_MOVE_CHILDREN
        });
    }

    dragEnd(me, editPart) {
        let cmd = editPart.getCommand({
            editPart: editPart,
            target: me.prop.drag,
            event: me,
            type: constants.REQ_MOVE_CHILDREN
        });
    }
}

let layoutPolicy = anra.gef.LayoutPolicy.extend({
    showTargetFeedback(request) {
        let feedback, editParts = this.editParts = this.getLayoutEditParts(request);

        if (constants.REQ_CREATE == request.type) {
            this.showCreateFeedback(request)
        }

    },
    showCreateFeedback(request) {
        let feedback, editParts = this.editParts = this.getLayoutEditParts(request);

        if (editParts && editParts instanceof anra.gef.NodeEditPart) {
            feedback = this.getFeedback(editParts);
            feedback.offsetX = request.event.offsetX || feedback.offsetX;
            feedback.offsetY = request.event.offsetY || feedback.offsetY;
            this.refreshFeedback(feedback, request, feedback.offsetX, feedback.offsetY);
        } else if (editParts == null) {
            //说明此处不可放置
            let editPart = this.getHost();

            editPart.figure.setStyle({
                cursor: "not-allowed"
            });
        }
    },

    eraseLayoutTargetFeedback(request) {
        //TODO
        this.editParts = null;
        var values = this.feedbackMap.values();
        for (var i = 0, len = values.length; i < len; i++) {
            this.removeFeedback(values[i]);
        }
        this.feedbackMap.clear();
    },

    showMoveChilrenFeedback(request) {

    }
});