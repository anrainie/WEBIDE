import {$AG} from './anra.flow'
import {anra} from './anra.gef'
import {ReaderListener} from './smoothRouter'
import {Map, Util} from './anra.common'

$AG.Editor.prototype.initRootEditPart = function (editPart) {
    editPart.addEditPartListener(new ReaderListener());
};

/*关于json传入转出输入形式*/
//仅仅初始化生成图 粗糙版
var resolveData = function(editorConfig, json) {
    //错误判断，忽略
    
    var nodes = json.Root.Regulation.Step, 
        result = deepCopy(editorConfig);
    
    result.data = [];
    result.line = [];
    
    if (nodes.length == 0) {
        return;
    }
    
    var location, size;
    nodes.forEach(function(item, index, input) {
        location = item.Constraint.Location.split(',');
        size = item.Constraint.Size.split(',');
        result.data[index] = Object.assign({
            id : item.Id,
            type : item.Type,
            bounds : [parseInt(location[0]), parseInt(location[1]), 
                      parseInt(size[0]), parseInt(size[1])],
            desp: item.Desp
        }, item);
        
        
        if (item.SourceConnections && 
            item.SourceConnections.Connection && 
            item.SourceConnections.Connection.length > 0) {
            item.SourceConnections.Connection.forEach(function(item1, index1, input1) {
                result.line.push({
                    //id问题 
                    id: createID(), 
                    source: item.Id, 
                    type: 0, 
                    target: item1.targetId, 
                    exit: item1.SourceTerminal, 
                    entr: item1.TargetTerminal
                });
            });
        }
    });
    
    //假装知道
    result.uuid = json.Root.UUID;
    result.DateInfo = json.Root.DateInfo;
    result.NodeMaxnimum = json.Root.NodeMaxnimum;
    
    return result;
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
    var count = 0;
    return function () {
        return count++;
    }
})();

//暂时性
$AG.Editor.prototype.createID = createID;

$AG.Editor.prototype.createNodeWithPalette = function(type) {
    var config = this.config.children[type], editor = this;
    
    if (config == null) {
        return null;
    }
    
    return function () {
        var node = new $AG.Node();

        node.props = {
            id: editor.createID(),
            name: config.name,
            type: type,
            bounds: config.bounds
        };

        editor.setActiveTool(new anra.gef.CreationTool(node));
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

export {$AG}