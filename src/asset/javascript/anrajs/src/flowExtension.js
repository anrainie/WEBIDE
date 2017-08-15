import {$AG} from './anra.flow'
import Base from '../lib/Base'
import {anra} from './anra.gef'
import * as constants from './anra.constants'
import {ReaderListener} from './smoothRouter'
import {Map, Util} from './anra.common'

$AG.EditPartListener = anra.gef.EditPartListener;

$AG.Editor.prototype.initRootEditPart = function (editPart) {
    editPart.addEditPartListener(new ReaderListener());
    editPart.config = this.config;
    editPart.addNotify();
};

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

const center = 0;
const begin = 1;
const end = 2;
const fill = 3

var gridData = Base.extend({
    constructor: function (width, height) {
        var arg = {
                horizontalSpan: 1,
                verticalSpan: 1,

                verticalAlignment: fill,
                horizontalAlignment: fill,
                widthHint: width,
                heightHint: height
            },
            createDes = function (argument, argName) {
                return {
                    set: function (value) {
                        if (argument[argName] == value) return;

                        argument[argName] = value;

                    },

                    get: function () {
                        return argument[argName];
                    },

                    enumerable: true,
                    configurable: false
                }
            },
            dirty = false,
            descriptors = {};

        for (var i in arg) {
            descriptors[i] = createDes(arg, i);
        }
        Object.defineProperties(this, descriptors);

        this.isDirty = function () {
            return dirty;
        }

        this.compute = function (size, location) {
            dirty = false;
            return this._compute(size, location);
        }
    },
    _compute: function (size, location) {
        if (size == null || !(size instanceof Array)) {
            console.error('no size')
        }

        if (location == null || !(location instanceof Array)) {
            console.error('no location')
        }

        var result = {}, width = this.widthHint*this.horizontalSpacing, height = this.heightHint*this.verticalSpacing;

        if (size[0] > width && this.horizontalAlignment != fill) {
            switch (this.horizontalAlignment) {
                case center:
                    result.x = location[0] + (size[0] - width) / 2;
                    break;
                case begin:
                    result.x = location[0];
                    break;
                case end:
                    result.x = location[0] + (size[0] - width);
                    break;
                default:
                    console.error();
            }
            result.width = this.width;
        } else {
            result.x = location[0];
            result.width = size[0];
        }

        if (size[1] > height && this.verticalAlignment != fill) {
            switch (this.verticalAlignment) {
                case center:
                    result.y = location[1] + (size[1] - height) / 2;
                    break;
                case begin:
                    result.y = location[1];
                    break;
                case end:
                    result.y = location[1] + (size[1] - height);
                    break;
                default:
                    console.error()
            }
            result.height = this.height;
        } else {
            result.y = location[1];
            result.height = size[1]
        }

        return result;
    }
});
   

var gridLayout = Layout.extend({    
    constructor: function(numColumns, makeColumnsEqualWidth) {
        /*参数列表*/
        var arg = {
            numColumns: 10, //列数目
            numRows: NaN, //默认undefined
            makeColumnsEqualWidth: true,//列是否具有相同的宽度
            makeRowsEqualHeight: true,
            marginLeft: 2,
            marginTop: 2,
            marginRight: 2,
            marginBottom: 2,
            horizontalSpacing: 15,
            verticalSpacing: 15,
            width: 0,
            height: 0,
            autoAdapt: false
        }, v = this, dirty = false;
        
        /*arg不可重写*/
        Object.defineProperty(v, "arg", {
            value: {},
            writable: false,
            enumerable: true,
            configurable: false
        });
        
        /*辅助函数，返回属性配置对象*/
        var createDes = function(argument, argName) {
            return {
                /*记录改变参数的状态*/
                set: function(value) {
                    if (value == argument[argName]) return;
                    
                    argument[argName] = value;
                    dirty = true;
                },
                
                get: function() {
                    return argument[argName];
                },
                enumerable: true,
                configurable: false
            }
        }
        
        var descriptors = {};
        
        for (var i in arg) {
            descriptors[i] = createDes(arg, i);
        };
        Object.defineProperties(v.arg, descriptors)
        
        /*只读*/
        this.isDirty = function() {
            return dirty;
        }
        
        /*dirty状态在layout后刷新*/
        this.layout = function(comp) {
            v._layout(comp);
            dirty = false;
        } 
    },
    
    _layout: function(comp) {
        if (comp.children == null || (comp.children instanceof Array && comp.children.length < 1)) {
            return;
        }
        
        var children = comp.children, arg = this.arg, 
            /*layout参数、data参数、children顺序、长度*/
            dirty;
        
        dirty = this.isDirty();
        
        /*暂时初始化layoutdata*/
        for (var i in children) {
            if (children[i].layoutData) {
                dirty = dirty | children[i].layoutData.dirty | !(i == children[i].layoutData.sequence);
            } else {
                children[i].layoutData = new gridData(children[i].model.props.bounds[2], children[i].model.props.bounds[3]);
                children[i].layoutData.sequence = i;
                dirty = true;
            }
        }
        
        dirty = dirty | arg.height != comp.bounds['height'] | arg.width != comp.bounds['width'];
        
        /*拦截计算*/
        if (!dirty) return;
        
        arg.height = comp.bounds['height'];
        arg.width = comp.bounds['width'];
        
        /*计算控件分布*/
        var grid = this.computeGrid(children),
            widthList = this.computeLengthList(true, grid), 
            heightList = this.computeLengthList(false, grid);
        
        //获取参数
        var width = arg.width, height = arg.height, columnCount = arg.numColumns, rowCount = arg.numRows;
        
        var x = arg.marginLeft, y = arg.marginTop, max = Math.max, min = Math.min, item, size;
        
        var tempMap = new Map(), v = this;
        
        for (var i = 0; i < rowCount; y+=(heightList[i++] + arg.verticalSpacing)) {
            for (var j = 0; j < columnCount; x+=(widthList[j++] + arg.horizontalSpacing)) {
                if (grid[i][j] == null) continue;
                
                if (!tempMap.has(grid[i][j])) {
                    tempMap.put(grid[i][j], {size: [widthList[j], heightList[i]], location: [x, y], first: i, current: i});
                    continue;
                }
                
                item = tempMap.get(grid[i][j]);
                if (item.first == i) {
                    item.size[0] += (widthList[j] + arg.horizontalSpacing); 
                } 
                
                if (item.current != i) {
                    item.size[1] += (heightList[i] + arg.verticalSpacing);
                    item.current = i;
                }
            }
            x = arg.marginLeft;
        }
        
        tempMap.forEach(function(value, key) {
            key.setBounds(key.layoutData.compute(value.size, value.location))
            v.refreshModel(key, key.bounds)
        });
    },
    
    computeGrid: function(children) {
        var count = children.length, max = Math.max, min = Math.min;
        
        var row = 0, column = 0, rowCount = 0, columnCount = this.arg.numColumns,
            grid = [[]];
        
        var hSpan, vSpan, endCount, index;
        
        for (var i = 0; i <　count; i++) {
            hSpan = max(1, min(children[i].layoutData.horizontalSpan, columnCount));
            vSpan = max(1, children[i].layoutData.verticalSpan);
            
            //寻找足够大的区域
            while (true) {
                if (grid[row] == null) {
                    grid[row] = [];
                }
                
                while(column < columnCount && grid[row][column]) column++;
                
                endCount = column + hSpan;
                if (endCount <= columnCount) {
                    index = column;
                    
                    while (index < endCount && grid[row][index] == null) index++;
                    
                    if (index == endCount) {
                        break;
                    }
                    
                    column = index;
                }
                
                if (column + hSpan >= columnCount) {
                    column = 0;
                    row++;
                }
            }
            
            
            for (var j = 0; j <　vSpan; j++) {
                if (grid[row + j] == null) {
                    grid[row + j] = [];
                }
                
                for (var k = 0; k < hSpan; k++) {
                    grid[row + j][column + k] = children[i];
                }
            }
            
            rowCount = max (rowCount, row + vSpan);
            column += hSpan;
        }
        
        this.arg.numRows = rowCount;
        return grid;
    },
    
    computeLengthList: function(isHorizontal, grid) {
        /*初始化*/
        var arg = this.arg, column, row, equal, spacing ,length, columnSpan, rowSpan, hint, g;
        if (isHorizontal) {
            column = arg.numColumns;
            row = arg.numRows;
            equal = arg.makeColumnsEqualWidth;
            spacing = arg.horizontalSpacing;
            length = arg.width - spacing*(column - 1) - (arg.marginLeft + arg.marginRight);
            columnSpan = "horizontalSpan";
            rowSpan = "verticalSpan";
            hint = "widthHint";
            g = function(x, y) {
                return grid[x][y];
            }
        } else {
            column = arg.numRows;
            row = arg.numColumns;
            equal = arg.makeRowsEqualHeight;
            spacing = arg.verticalSpacing;
            length = arg.height - spacing*(column - 1) - (arg.marginTop + arg.marginBottom);
            columnSpan = "verticalSpan";
            rowSpan = "horizontalSpan";
            hint = "heightHint";
            g = function(x, y) {
                return grid[y][x];
            }
        }
        
        var lengthList = new Array(column);
        
        lengthList.fill(0);
        
        var data, cSpan;
        var max = Math.max, min = Math.min;
        
        /*计算单位距离单占据最大长度*/
        for (var i = 0; i < column; i++) {
            for (var j = 0; j < row; j++) {
                
                if (g(j, i) == null) continue;
                
                data = g(j, i).layoutData;
                cSpan = max(1, min(data[columnSpan], column));
                
                if (cSpan == 1) {
                    lengthList[i] = max(lengthList[i], data[hint]);
                }
            }
        }
        
        /*多占据*/
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < column; j++) {
                
                if (g(i, j) == null) continue;
                
                data = g(i, j).layoutData;
                cSpan = max(1, min(data[columnSpan], column));
                
                if (cSpan <= 1) continue;
                
                for (var k = j; k < j + cSpan - 1; k++) {
                    lengthList[k] = max(data[hint], lengthList[k]);
                }
                
                j += cSpan - 1;
            }
        }
        
        var total = 0;
        
        for (var i = 0; i < column; i++) {
            total += lengthList[i];
        }
        
        /*单位距离都相等*/
        if (equal) {
            var cellLenght = ~~(length / column) , maxLength = 0;
            
            lengthList.forEach(function(item) {
                maxLength = max(maxLength, item);
            });
            
            lengthList.fill(arg.autoAdapt ? cellLenght : min(maxLength, cellLenght));
            
            return lengthList;
        }
        
        if (total > length || arg.autoAdapt) {
            lengthList.forEach(function(item, index, input) {
                input[index] = item*length/total;
            });
        }
         
        return lengthList;
    }
});

anra.svg.Image.layoutManager = new fillLayout();


/*编辑器缓冲*/
var editorBuffer = function() {
    var pool = new Map(), activateEditorKey = null;
    
    this.put = function(id, editor) {
        pool.put(id, editor);
        activateEditorKey = id;
    }
    
    this.isBuffer = function(id) {
        return pool.has(id);
    }
    
    this.isActivateEditor = function(id) {
        return id == activateEditorKey;
    }

    this.activateEditor = function(id) {
        activateEditorKey = id;
        return pool.get(id); 
    }
    
    this.valuesOfBuffer = function() {
        return pool.values();
    }
    
    
    this.clear = function() {
        activateEditorKey = null;
        pool.clear();
    }
};
$AG.editorBuffer = editorBuffer;


export {$AG}