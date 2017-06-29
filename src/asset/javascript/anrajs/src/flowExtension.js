import {$AG} from './anra.flow'
import {anra} from './anra.gef'
import {ReaderListener} from './smoothRouter'
import {Map} from './anra.common'

//生成画板分组，粗糙版
$AG.Editor.prototype.createPalette = function (id) {
    var i = id + 'Plt';
    var div = document.createElement('div');
    div.setAttribute('id', id + 'Plt');
    div.style.position = 'relative';
    div.style.width = '10%';
    div.style.height = '100%';
    div.style.float = 'left';
    div.style.backgroundColor = '#CCCCCC';

    //工具
    var selectTool = document.createElement('button'),
        linkTool = document.createElement('button'),
        
        sm, lm, editor = this;

    selectTool.setAttribute('class', 'pltItem');
    selectTool.onmousedown = function () {
        editor.setActiveTool(editor.getDefaultTool());
    };
    sm = document.createElement('img');
    sm.setAttribute('src', 'assets/image/editor/select.gif');
    selectTool.appendChild(sm);

    linkTool.setAttribute('class', 'pltItem');
    
    //linetext
    var lineTool = new $AG.LineTool({id: 3, type: 0,target: 5, entr: 7, exit: 6});
    
    linkTool.onmousedown = function () {
        if (editor.getActiveTool() == lineTool) {
            editor.setActiveTool(editor.getDefaultTool());
        } else
            editor.setActiveTool(lineTool);
        return false;
    };
    lm = document.createElement('img');
    lm.setAttribute('src', 'assets/image/editor/link.gif');
    linkTool.appendChild(lm);

    div.appendChild(selectTool);
    div.appendChild(linkTool);
    div.appendChild(document.createElement('p'));

    //组
    var group = this.config.group;
    if (group) {
        var g, items;

        for (var i in group) {
            g = document.createElement('p');
            g.innerHTML = group[i].name;
            div.appendChild(g);

            items = group[i].items;
            if (items) {
                for (var j = 0; j < items.length; j++) {
                    div.appendChild(this.createPaletteItem(items[j]));
                    div.appendChild(document.createTextNode(editor.config.children[items[j]].name));
                    div.appendChild(document.createElement('p'));
                }
            }
            div.appendChild(document.createElement('p'));
        }
    }
    
    var b = document.createElement('button'), editor = this;
    b.setAttribute('class', 'pltItem');
    b.onclick = function(e) {
        editor.showMap1();
    };
    div.appendChild(b);
    
    var b1 = document.createElement('button');
    b1.setAttribute('class', 'pltItem');
    b1.onclick = function(e) {
        editor.deleteHandle();
    };
    div.appendChild(b1);
    
    var b2 = document.createElement('button');
    b2.setAttribute('class', 'pltItem');
    b2.onclick = function(e) {
        editor.changePos();
    };
    div.appendChild(b2);
    
    this.element.appendChild(div);
    //return new anra.gef.Palette(i);
};

$AG.Editor.prototype.createPaletteItem = function (type) {
    var config = this.config.children[type],
        item, editor = this;

    if (config == null) {
        throw '没有这种类型的Node';
    }

    item = document.createElement('img');
    item.setAttribute('class', 'pltItem');
    item.setAttribute('src', config.paletteUrl);

    item.onmousedown = function () {
        var json = {
                id: createID(),
                name: config.name,
                type: type,
                bounds: config.bounds
            },
            node = new anra.gef.NodeModel();

        node.props = json;
        editor.setActiveTool(new anra.gef.CreationTool(node));
        return true;
    };

    item.ondragstart = function () {
        return false;
    }
    
    return item;
};

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

var createID = (function () {
    var count = 0;
    return function () {
        return count++;
    }
})();

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
            layer.addChild(arr.last(), false);
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