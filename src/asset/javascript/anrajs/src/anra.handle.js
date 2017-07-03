/**
 * Created by weiyajun on 2016/8/9 0009.
 */
import {Map, Util} from './anra.common'
import Base from '../lib/Base'
import {anra} from './anra.gef'

//anra = anra || {};
var Control = anra.svg.Control;

anra.Handle = Control.extend({
    editPart:null,
    listener:null,
    constructor:function (editPart) {
        Control.prototype.constructor.call(this);
        this.editPart = editPart;
        this.ready=true;
    },

    createContent:function (s) {
        var t = this;
        this.listener = function (f) {
            t.refreshLocation(f);
        };
        this.editPart.getFigure().addRepaintListener(this.listener);
        this.refreshLocation(this.editPart.getFigure());

        this.initListeners();
    },
    dispose:function () {
        this.editPart.getFigure().removeRepaintListener(this.listener);
        Control.prototype.dispose.call(this);
    },
    getDragTracker:function () {
        return this;
    },
    initListeners:function () {
        var _dt = this.editPart.getRoot().editor.getTopDragTracker();
        var _ep = this;
        this.on(anra.EVENT.MouseDown, function (e) {
            _dt.mouseDown(e, _ep);
        });
        this.on(anra.EVENT.MouseIn, function (e) {
            _dt.mouseIn(e, _ep);
        });
        this.on(anra.EVENT.MouseOut, function (e) {
            _dt.mouseOut(e, _ep);
        });
        this.on(anra.EVENT.MouseClick, function (e) {
            _dt.mouseClick(e, _ep);
        });
        this.on(anra.EVENT.DragStart, function (e) {
            _dt.dragStart(e, _ep);
        });
        this.on(anra.EVENT.DragEnd, function (e) {
            _dt.dragEnd(e, _ep);
        });
        this.on(anra.EVENT.MouseDrag, function (e) {
            _dt.mouseDrag(e, _ep);
        });
        this.on(anra.EVENT.MouseMove, function (e) {
            _dt.mouseMove(e, _ep);
        });
        this.on(anra.EVENT.MouseUp, function (e) {
            _dt.mouseUp(e, _ep);
        });
        this.on(anra.EVENT.Dropped, function (e) {
            _dt.dragDropped(e, _ep);
        });
    },
    refreshLocation:function (figure) {

    }
});


anra.gef.LineHandle = anra.Handle.extend({
    constructor:function (editPart, style) {
        Control.prototype.constructor.call(this);
        this.editPart = editPart;
        this.setStyle(style);
    },
    _init:function () {
        this.bds = {'x':0, 'y':0, 'width':100, 'height':100};
        if (this.init != null)this.init();
    },
    dragStart:function (e, p) {
        var tool = new anra.gef.LinkLineTool();
        tool.linePart = this.editPart;
        tool.type = this.type;
        tool.oldAnchor = this.type == constants.REQ_RECONNECT_SOURCE ? this.editPart.figure.sourceAnchor : this.editPart.figure.targetAnchor;
        this.editPart.getRoot().editor.setActiveTool(tool);
        return true;
    },
    dragDropped:function (e, p) {
//        var editor = this.editPart.getRoot().editor;
//        editor.setActiveTool(editor.getDefaultTool());
//        return true;
    },
    refreshLocation:function (figure) {
        var points = figure.points;
        var p;
        if (this.type == constants.REQ_RECONNECT_SOURCE) {
            p = points[0];
        } else if (this.type == constants.REQ_RECONNECT_TARGET) {
            p = points[points.length - 1];
        }
        var w = 6;
        var hf = w / 2;

        this.setBounds({x:p.x, y:p.y - hf, width:w, height:w}, true);
//        this.paint();
    },
    initProp:function () {
        this.setAttribute({
            fill:'white',
            stroke:'blue'
        });
        this.setStyle({'cursor':'move'});
    }
});

anra.ResizeHandle = Control.extend({
    //const
    defaultWidth:4,
    defaultHeight:4,
    offset:2,
    //data
    editPart:null,
    direction:null,
    constructor:function (editPart, direction) {
        Control.prototype.constructor.call(this);
        this.editPart = editPart;
        this.direction = direction;
        var model = editPart.model;
        if (model != null) {
            this.setLocator(editPart.getFigure().bounds);
            this.setStyle({
                'stroke':'#000000',
                'fill':'#FFFFFF'
            });
//            var dt = this.getResizeTracker(direction);
//            this.on(anra.EVENT.MouseDown, function (e) {
//                if (dt != null)
//                    dt.mouseDown(e, editPart);
//            });
//            this.on(anra.EVENT.DragStart, function (e) {
//                if (dt != null)
//                    dt.dragStart(e, editPart);
//            });
//            this.on(anra.EVENT.DragEnd, function (e) {
//                if (dt != null)
//                    dt.dragEnd(e, editPart);
//            });
//            this.on(anra.EVENT.MouseDrag, function (e) {
//                if (dt != null)
//                    dt.mouseDrag(e, editPart);
//            });
//            this.on(anra.EVENT.MouseUp, function (e) {
//                if (dt != null)
//                    dt.mouseUp(e, editPart);
//            });
//            this.on(anra.EVENT.MouseClick, function (e) {
//                if (dt != null&&dt.mouseClick!=null)
//                    dt.mouseClick(e, editPart);
//            });
        }

    },

    setLocator:function (bounds) {
        var width = bounds.width;
        var height = bounds.height;
        var x = bounds.x - this.offset;
        var y = bounds.y - this.offset;

        var cursorStyle;
        cursorStyle = this.direction + '-resize';
        if (this.direction.search('e') != -1) {
            x += width;
        }
        if (this.direction.search('(w|e)') == -1) {
            x += width / 2;
        }
        if (this.direction.search('s') != -1) {
            y += height;
        }
        if (this.direction.search('(n|s)') == -1) {
            y += height / 2;
        }
        this.setBounds({
            x:x,
            y:y,
            width:this.defaultWidth,
            height:this.defaultHeight
        },true);
        this.setStyle({
            'cursor':cursorStyle
        });
    },
    refreshLocation:function (f) {
        this.setLocator(f.bounds,true);
    },
    getResizeTracker:function (direction) {
        return  anra.gef.ResizeTracker.getInstance(direction);
    }
});

/*anra.NORTH = "n";
anra.SOUTH = "s";
anra.EAST = "e";
anra.WEST = "w";
anra.CENTER="c";
anra.NORTH_EAST = "ne";
anra.NORTH_WEST = "nw";
anra.SOUTH_EAST = "se";
anra.SOUTH_WEST = "sw";*/

anra.gef.ResizeTracker = Base.extend({
    status:null,
    xStart:0,
    yStart:0,
    oldConstraint:null,
    mouseDown:function (me, editPart) {
        this.status = me.type;
    },
    dragStart:function (me, editPart) {
        this.ondrag = true;
        this.status = me.type;
        this.xStart = me.x;
        this.yStart = me.y;
        this.oldConstraint = {
            x:editPart.model.get('bounds')[0],
            y:editPart.model.get('bounds')[1],
            width:editPart.model.get('bounds')[2],
            height:editPart.model.get('bounds')[3]
        };

    },
    dragEnd:function (me, editPart) {
        if (!this.ondrag)return;
        this.status = me.type;
        editPart.editor.execute(new anra.gef.RelocalCommand(editPart, this.oldConstraint, {
            x:editPart.model.get('bounds')[0],
            y:editPart.model.get('bounds')[1],
            width:editPart.model.get('bounds')[2],
            height:editPart.model.get('bounds')[3]
        }));
        anra.gef.DragTracker.prototype.dragEnd.call({host:editPart}, me, editPart);
        this.ondrag = false;
    },
    mouseUp:function (me, editPart) {
        this.status = me.type;
    }
});

anra.gef.ResizeTracker.getInstance = function (direction) {
    var tracker = trackPool.get(direction);
    if (tracker == null)
        return new anra.gef.ResizeTracker();
    return tracker;
}


anra.gef.NorthWestTracker = anra.gef.ResizeTracker.extend({
    mouseDrag:function (me, editPart) {
        this.status = me.type;
        editPart.model.get('bounds')[0] = this.oldConstraint.x + (me.x - this.xStart);
        editPart.model.get('bounds')[1] = this.oldConstraint.y + (me.y - this.yStart);
        editPart.model.get('bounds')[2] = this.oldConstraint.width - (me.x - this.xStart);
        editPart.model.get('bounds')[3] = this.oldConstraint.height - (me.y - this.yStart);
        editPart.refresh();
    }
});
anra.gef.NorthTracker = anra.gef.ResizeTracker.extend({
    mouseDrag:function (me, editPart) {
        this.status = me.type;
        editPart.model.get('bounds')[1] = this.oldConstraint.y + (me.y - this.yStart);
        editPart.model.get('bounds')[3] = this.oldConstraint.height - (me.y - this.yStart);
        editPart.refresh();
    }
});
anra.gef.NorthEastTracker = anra.gef.ResizeTracker.extend({
    mouseDrag:function (me, editPart) {
        this.status = me.type;
        editPart.model.get('bounds')[1] = this.oldConstraint.y + (me.y - this.yStart);
        editPart.model.get('bounds')[2] = this.oldConstraint.width + (me.x - this.xStart);
        editPart.model.get('bounds')[3] = this.oldConstraint.height - (me.y - this.yStart);
        editPart.refresh();
    }
});

anra.gef.WestTracker = anra.gef.ResizeTracker.extend({
    mouseDrag:function (me, editPart) {
        this.status = me.type;
        editPart.model.get('bounds')[0] = this.oldConstraint.x + (me.x - this.xStart);
        editPart.model.get('bounds')[2] = this.oldConstraint.width - (me.x - this.xStart);
        editPart.refresh();
    }
});
anra.gef.EastTracker = anra.gef.ResizeTracker.extend({
    mouseDrag:function (me, editPart) {
        this.status = me.type;
        editPart.model.get('bounds')[2] = this.oldConstraint.width + (me.x - this.xStart);
        editPart.refresh();
    }
});

anra.gef.SouthWestTracker = anra.gef.ResizeTracker.extend({
    mouseDrag:function (me, editPart) {
        this.status = me.type;
        editPart.model.get('bounds')[0] = this.oldConstraint.x + (me.x - this.xStart);
        editPart.model.get('bounds')[2] = this.oldConstraint.width - (me.x - this.xStart);
        editPart.model.get('bounds')[3] = this.oldConstraint.height + (me.y - this.yStart);
        editPart.refresh();
    }
});
anra.gef.SouthTracker = anra.gef.ResizeTracker.extend({
    mouseDrag:function (me, editPart) {
        this.status = me.type;
        editPart.model.get('bounds')[3] = this.oldConstraint.height + (me.y - this.yStart);
        editPart.refresh();
    }
});
anra.gef.SouthEastTracker = anra.gef.ResizeTracker.extend({
    mouseDrag:function (me, editPart) {
        this.status = me.type;
        editPart.model.get('bounds')[2] = this.oldConstraint.width + (me.x - this.xStart);
        editPart.model.get('bounds')[3] = this.oldConstraint.height + (me.y - this.yStart);
        editPart.refresh();
    }
});


var trackPool = new Map();
trackPool.put(anra.NORTH, new anra.gef.NorthTracker());
trackPool.put(anra.SOUTH, new anra.gef.SouthTracker());
trackPool.put(anra.SOUTH_EAST, new anra.gef.SouthEastTracker());
trackPool.put(anra.SOUTH_WEST, new anra.gef.SouthWestTracker());
trackPool.put(anra.NORTH_WEST, new anra.gef.NorthWestTracker());
trackPool.put(anra.NORTH_EAST, new anra.gef.NorthEastTracker());
trackPool.put(anra.EAST, new anra.gef.EastTracker());
trackPool.put(anra.WEST, new anra.gef.WestTracker());

anra.gef.TextHandle = anra.Handle.extend(anra.svg.Text).extend({
    refreshLocation: function (figure) {
        this.bounds = {x: figure.bounds.x, y: figure.bounds.y + figure.bounds.width};
    }

});

export {anra}