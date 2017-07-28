import {$AG} from './anra.flow'
import Base from '../lib/Base'
import {anra} from './anra.gef'
import * as constants from './anra.constants'
import {ReaderListener} from './smoothRouter'
import {Map, Util} from './anra.common'

$AG.Editor.prototype.initRootEditPart = function (editPart) {
    editPart.addEditPartListener(new ReaderListener());
    editPart.config = this.config;
    /*add 增加对应的节点有效地子节点
    var config = this.config, available = config.available, children = this.config.children;
    if (available == null) {
        return;
    }

    for (var type in available) {
        if (children[type] == null) {
            console.error(type + '类型节点不对')
        }

        if (available[type] == null || available[type].length < 1) {
            continue;
        }
        
        children[type].available = {};

        for (var i in available[type]) {
            if (children[available[type][i]] == null) {
                console.error(type + '类型节点不对')
            }

            children[type].available[i] = available[type][i];
        }
    }*/
    
    editPart.addNotify();
};

/*关于json传入转出输入形式*/
//仅仅初始化生成图 粗糙版
var resolveData = function(editorConfig, modelConfig) {
    //TODO 错误判断
    var ec = deepCopy(editorConfig),
        mc = deepCopy(modelConfig);
    
    
    //DateInfo
    ec.DateInfo = mc.DateInfo || null;
    
    //NodeMaxnimum
    ec.NodeMaxnimum = mc.NodeMaxnimum || null;
    
    //UUID
    ec.UUID = mc.UUID || null;

    //Regulation
    if (mc.Regulation == null || mc.Regulation.Step == null) {
        return ec;
    }
    
    //Step 里面没有节点是null,只有一个节点的时候是Object，多节点是Array
    var nodes = mc.Regulation.Step, location, size;
    
    ec.data = [];
    ec.line = [];
    
    if (!(nodes instanceof Array) && nodes instanceof Object) {
        nodes = [nodes];
    }
    
    nodes.forEach(function (item, index, input) {
        location = item.Constraint.Location.split(',');
        size = item.Constraint.Size.split(',');
        ec.data[index] = Object.assign({
            id: item.Id,
            type: item.Type,
            bounds: [parseInt(location[0]), parseInt(location[1]),
                         parseInt(size[0]), parseInt(size[1])],
            desp: item.Desp
        }, item);

        if (item.SourceConnections &&
            item.SourceConnections.Connection) {
            
            //单线为Object
            if (!(item.SourceConnections.Connection instanceof Array)) {
                item.SourceConnections.Connection = [item.SourceConnections.Connection];
            }
            
            item.SourceConnections.Connection.forEach(function (item1, index1, input1) {
                ec.line.push({
                    //id问题 
                    id: item.Id + '_' + item1.targetId,
                    source: item.Id,
                    type: 0,
                    target: item1.targetId,
                    exit: item1.SourceTerminal,
                    entr: item1.TargetTerminal
                });
            });
        }
    });
    
    return ec;
}
$AG.resolveData = resolveData;

var deepCopy= function(source) { 

    var result;
    
    if (source instanceof Array) {
        result = [];
        for (var i = 0; i < source.length; i++) {
            result[i] = source[i];
        }
    } else {
        result = {};
        for (var key in source) {
            result[key] = source[key] instanceof Array ? deepCopy(source[key]) : typeof source[key]==='object'? deepCopy(source[key]): source[key];
        }
    }
    
   return result; 
}
$AG.deepCopy = deepCopy;

var createID = (function () {
    var count = 100;
    return function () {
        return count++;
    }
})();

//暂时性
$AG.Editor.prototype.createID = createID;

$AG.Editor.prototype.createNodeWithPalette = function(type, item) {
    var editor = this, tool = new anra.gef.CreationTool();
    
    if (!(item && type)) {
        return null;
    }
    
    return function () {
        var node = new $AG.Node();

        node.props = {
            id: editor.createID(),
            type: type,
            bounds: [0, 0, item.size[0], item.size[1]]
        };
        tool.model = node;
        
        editor.setActiveTool(tool);
        return true;
    }
};


//打印地图节点
$AG.Editor.prototype.showMap = function() {
    var root = this.rootEditPart, reader = root.getReader(),
        layer = root.getLineLayer();
    
    reader.structure();
    reader.struct.forEach(function(value, key) {
        if (value.count == 0) {
            if (value.figure) {
                layer.removeChild(value.figure)
                delete value.figure;
            }
        } else if (value.count > 0) {
            if (value.figure == null) {
                value.figure = new mapHandle(key);
                layer.addChild(value.figure, false)
            }
        } else {
            console.warn('count 负数')
        }
    });
}

$AG.Editor.prototype.showMapMap = [];
$AG.Editor.prototype.showMap1 = function(){
     var root = this.rootEditPart, reader = root.getReader(),
         layer = root.getLineLayer(), arr = this.showMapMap;
     
    if (arr.length > 0) {
        arr.forEach(function(item, index, input) {
            layer.removeChild(item);
        });
    }
    
    reader.structure();
    
    reader.struct.forEach(function(value, key) {
        if (value.count > 0) {
            arr.push(new mapHandle(key))
            layer.addChild(Util.last.call(arr), false);
        } else if (value.count == 0) {
            console.warn('count 为0')
        } else {
            console.warn('count 负数')
        }
    });
}

$AG.Editor.prototype.deleteHandle = function() {
    var layer = this.rootEditPart.getLineLayer(), arr = this.showMapMap;
     
    if (arr.length > 0) {
        arr.forEach(function(item, index, input) {
            layer.removeChild(item);
        });
    }
}

$AG.Editor.prototype.changePos = function() {
    var root = this.rootEditPart, models = root.model.children;
    for(var node in models) {
        models[node].set('bounds', [Math.random()*1000,Math.random()*1000,50,50]);
    }
    
    root.children.forEach(function(item, index, input) {
        if (item instanceof anra.gef.NodeEditPart) {
            item.refresh();
        }
    })
}

var mapHandle = anra.svg.Composite.extend({
    constructor: function (key) {
        anra.svg.Control.prototype.constructor.call(this);
        this.setAttribute({
            'stroke-width': 1,
            stroke: 'red'
        });
        this.setOpacity(0.5);
        
        var temp, x, y;
        if (key) {
            temp = key.split('_');
            x = parseInt(temp[0]);
            y = parseInt(temp[1]);
        }
        
        this.setBounds({
            x: x * 25,
            y: y * 25,
            width: 25,
            height: 25
        });
    }
});

var Platform = {
    main : null,
    assist : null,
    pool : new Map(),
    isAssist : function(id) {
        return this.pool.get(id) == this.assist;
    }
};

//this.editor.rootEditPart.figure.dispatcher.dragTarget = this.linePart.figure;


//重新连线的测试策略
var testSelectionPolicy = anra.gef.SelectionPolicy.extend({
    _selected: false, 
    selected: function(editPart) {
        if (this._selected) {
            return;
        }
        this.color = this.getHostFigure().getStyle('stroke');
        if(this.color==null)
            this.color=this.getHostFigure().attr['stroke'];
        this.sw = this.getHostFigure().getStyle('stroke-width');
        this.getHostFigure().setStyle('stroke', 'red');
        this.getHostFigure().paint();
        
        this._selected = true;
    },
    unselected: function(editPart) {
        if (!this._selected) {
            return;
        }
        this.getHostFigure().setStyle({
            stroke: this.color,
            'stroke-width': this.sw
        });
        this.getHostFigure().paint();
        
        this._selected = false;
    },
    createSelectionHandles: function(selection) {
        return [new testLineHandle(this.getHost(), constants.REQ_RECONNECT_SOURCE), new testLineHandle(this.getHost(), constants.REQ_RECONNECT_TARGET)];
    }
});

anra.gef.LineSelectionPolicy = testSelectionPolicy;

var Control = anra.svg.Control;
var testLineHandle = anra.Handle.extend(anra.svg.Circle).extend({
    constructor: function(editPart, type) {
        Control.prototype.constructor.call(this);
        this.type = type;
        this.editPart = editPart;
    },
    initProp: function() {
        var anchor;
        if (this.type == constants.REQ_RECONNECT_SOURCE) {
            anchor = this.editPart.getSourceAnchor();
        } else if (this.type == constants.REQ_RECONNECT_TARGET) {
            anchor = this.editPart.getTargetAnchor();
        } else {
            console.error('chuan ru type cuo wu')
        }
        
        this.setOpacity(1);
        
        this.setAttribute({
            fill:'white',
            stroke:'blue'
        });
        this.setStyle({'cursor':'move'});
        
        this.setBounds({
            x: anchor.x,
            y: anchor.y,
            width: 10
        }, true);
        
    },
    refreshLocation:function (figure) {
        var points = figure.points;
        var p;
        if (this.type == constants.REQ_RECONNECT_SOURCE) {
            p = points[0];
        } else if (this.type == constants.REQ_RECONNECT_TARGET) {
            p = points[points.length - 1];
        }
        var w = 10;
        
        this.setBounds({x:p.x, y:p.y, width:w, height:w}, true);
    },
    dragStart: function() {
        var tool = new $AG.LineTool({
            id: 3,
            type: 0,
            target: 5,
            entr: 7,
            exit: 6
        });
        tool.linePart = this.editPart;
        tool.type = this.type;
        this.editPart.getRoot().editor.setActiveTool(tool);
        return true;
    }
});

//test layoutPolicy
var ContainerLayoutPolicy = anra.gef.LayoutPolicy.extend({
    createFeedback: function (ep) {
        var f = anra.FigureUtil.createGhostFigure(ep);
        var b = f.bounds;
        f.bounds = {width: b.width / 2, height: b.height / 2};
        return f;
    },
    getCreateCommand: function (request) {
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
$AG.ContainerLayoutPolicy = ContainerLayoutPolicy;


/***************关于布局****************/
var Layout = Base.extend({
    layout: function (comp) {
    }
});

var fillLayout = Layout.extend({
    horizontal: true,
    marginWidth: 0,
    marginHeight: 0,
    spacing: 0,
    layout: function(comp) {
        var children = comp.children, bounds = comp.getClientArea(), count;
        
        if (children == null || children.length == 0) {
            return;
        }
        count = children.length;
        
        var width = bounds[2] - 2*this.marginWidth,
            height = bounds[3] - 2*this.marginHeight;
        
        if (this.horizontal) {
            width -= (count - 1) * this.spacing;
            
            var x = this.marginWidth, extra = width % count,
                y = this.marginHeight, cellWidth = width / count,
                childWidth;
            
            for (var i = 0; i < count; i++) {
                childWidth = cellWidth;
                if (i == 0) {
                    childWidth += cellWidth;
                } else if (i == count - 1) {
                    childWidth += (extra + 1) / 2;
                }
                children[i].setBounds({
                    x: x,
                    y: y,
                    width: childWidth,
                    height: height
                });
                x += childWidth + this.spacing
            }
        } else {
            var x = this.marginWidth, extra = width % count,
                y = this.marginHeight, cellHeight = width / count,
                childHeight;
            
            for (var i = 0; i < count; i++) {
                if (i == 0) {
                    childHeight += cellHeight;
                } else if (i == count - 1) {
                    childHeight += (extra + 1) / 2;
                }
                children[i].setBounds({
                    x: x,
                    y: y,
                    width: width,
                    height: cellHeight
                });
                y += childHeight + this.spacing;
            }
        }
    }
});
anra.svg.Image.layoutManager = new fillLayout();

export {$AG}