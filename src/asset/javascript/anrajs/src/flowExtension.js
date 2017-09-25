import {$AG} from './anra.flow'
import Base from '../lib/Base'
import {anra} from './anra.gef'
import {ReaderListener} from './smoothRouter'
import {Map} from './anra.common'
import {defaultsDeep} from 'lodash'

/*用于参数忽略的时候*/
function throwIfMissing() {
  throw new Error('Missing parameter');
}

$AG.EditPartListener = anra.gef.EditPartListener;

$AG.Editor.prototype.initRootEditPart = function (editPart) {
    editPart.addEditPartListener(new ReaderListener());
    editPart.config = this.config;
    editPart.addNotify();
};

let createID = (() => {
    let count = 100;
    return () => count++
})();

//暂时性
$AG.Editor.prototype.createID = createID;

$AG.Editor.prototype.createNodeWithPalette = function(type, item) {
    let editor = this, tool = new anra.gef.CreationTool();
    
    if (!(item && type)) {
        return null;
    }
    
    return function () {
        let node = new $AG.Node();

        node.props = Object.assign({
            id: editor.createID(),
            type: type,
            bounds: [0, 0, item.size[0], item.size[1]]
        }, defaultsDeep(item.data));
        tool.model = node;
        
        editor.setActiveTool(tool);
        return true;
    }
};

$AG.Editor.prototype.getSaveData = function (attrNameArr) {
    let nodeStore = this.store.node, result, attrsItem;

    /*遍历DB所有record, 筛选属性数据*/

    result = nodeStore().select.apply(nodeStore(), attrNameArr).map((item) => {
        attrsItem = {};
        for (let [index, elem] of item.entries()) {
            if (elem) {
                attrsItem[attrNameArr[index]] = elem;
            }
        }

        return attrsItem;
    });

    return result;
}

//test layoutPolicy
var ContainerLayoutPolicy = anra.gef.LayoutPolicy.extend({
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
$AG.ContainerLayoutPolicy = ContainerLayoutPolicy;


/***************关于布局****************/
var Layout = Base.extend({
    layout(comp) {
    },
    refreshModel(figure, bounds) {
        figure.model.set('bounds', [
            bounds['x'],
            bounds['y'],
            bounds['width'],
            bounds['height']
        ])
    }
});

var fillLayout = Layout.extend({
    horizontal: true,
    marginWidth: 0,
    marginHeight: 0,
    spacing: 0,
    layout(comp) {
        var children = comp.children, bounds = comp.getClientArea(), count;
        
        if (children == null || children.length == 0) {
            return;
        }
        count = children.length;
        
        var width = bounds[2] - 2*this.marginWidth,
            height = bounds[3] - 2*this.marginHeight,
            x = this.marginWidth, 
            y = this.marginHeight,
            spacing = this.spacing;
        
        if (this.horizontal) {
            width -= (count - 1) * spacing;
            
            var extra = width % count, cellWidth = ~~(width / count),
                childWidth;
            
            /*每个子节点bounds设置*/
            children.forEach((item, index) => {
                
                /*宽度取整, 多余的分至左右两侧*/
                childWidth = cellWidth;
                childWidth += index == 0 ? ~~(extra / 2) : index == count - 1 ? ~~(extra + 1) / 2 : 0; 
                
                item.setBounds({
                    x: x,
                    y: y,
                    width: childWidth,
                    height: height
                });
                
                x += childWidth + spacing
            });
            
        } else {
            var extra = width % count, cellHeight = width / count,
                childHeight;
            
            children.forEach((item, index) => {
                
                /*高度取整， 多余的分至上下两侧*/
                childHeight = cellHeight;
                childHeight += index == 0 ? extra / 2 : index == count - 1 ? (extra + 1) / 2 : 0;
                
                item.setBounds({
                    x: x,
                    y: y,
                    width: width,
                    height: childHeight
                });
                
                y += childHeight + spacing;
            })
        }
    }
});

const center = 0;
const begin = 1;
const end = 2;
const fill = 3;

var gridData = Base.extend({
    constructor({horizontalSpan = 1, verticalSpan = 1, verticalAlignment = fill,
                    horizontalAlignment = fill, widthHint = 10, heightHint = 10} = {}) {
        const argumentData = {
                horizontalSpan,
                verticalSpan,
                verticalAlignment,
                horizontalAlignment,
                widthHint,
                heightHint
            }
        var dirty = false,
            descriptors = {};
    

        /*设置arguments里面属性改变调整dirty*/
        for (var key in argumentData) {            
            descriptors[key] = ((attributeName) => ({
                //为key制造一个上下文
                set(value) {
                    if (argumentData[attributeName] == value) return;
                    
                    dirty = true;
                    argumentData[attributeName] = value;
                },
                
                get() {
                    return argumentData[attributeName];
                },
                
                enumerable: true,
                configurable: false
            }))(key);
        }
        Object.defineProperties(this, descriptors);

        
        this.isDirty = () => dirty;

        /*这里严格规定compute调用后, dirty刷新*/
        this.compute = (size, location) => {
            dirty = false;
            return this._compute(size, location);
        }
    },
    _compute(size = throwIfMissing(), location = throwIfMissing()) {
        var result = {}, width = this.widthHint*this.horizontalSpan, height = this.heightHint*this.verticalSpan;

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
                    /*todo*/
                    console.error();
            }
            result.width = width;
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
                    /*todo*/
                    console.error()
            }
            result.height = height;
        } else {
            result.y = location[1];
            result.height = size[1]
        }

        return result;
    }
});
   

var gridLayout = Layout.extend({    
    constructor: function({ numColumns = 10, numRows, makeColumnsEqualWidth = true, makeRowsEqualHeight = true,
                           marginLeft = 2, marginTop = 2, marginRight = 2, marginBottom = 2, horizontalSpacing = 15,
                           verticalSpacing = 15, width = 0, height = 0, horizontalAutoAdapt = false, verticalAutoAdapt = false} = {}) {
        /*参数列表*/
        const argumentData = {
            numColumns, //列数目
            numRows, //默认undefined
            makeColumnsEqualWidth,//列是否具有相同的宽度
            makeRowsEqualHeight,
            marginLeft,
            marginTop,
            marginRight,
            marginBottom,
            horizontalSpacing,
            verticalSpacing,
            width,
            height,
            horizontalAutoAdapt,
            verticalAutoAdapt
        };
        var dirty = false;
    
        /*属性特性*/
        var descriptors = {};
        
        for (var key in argumentData) {
            descriptors[key] = ((attributeName) => ({
                /*记录改变参数的状态*/
                set(value) {
                    if (value == argumentData[attributeName]) return;
                    
                    argumentData[attributeName] = value;
                    dirty = true;
                },
                
                get() {
                    return argumentData[attributeName];
                },
                enumerable: true,
                configurable: false
            }))(key);
        }
        this.argumentData = {};
        Object.defineProperties(this.argumentData, descriptors)
        
        /*只读*/
        this.isDirty = () => dirty;
        
        /*dirty状态在layout后刷新*/
        this.layout = (comp) => {
            this._layout(comp);
            dirty = false;
        }
    },
    
    _layout(comp) {
        if (comp.children == null || (comp.children instanceof Array && comp.children.length < 1)) {
            return;
        }
        
        var children = comp.children, arg = this.argumentData, 
            /*layout参数、data参数、children顺序、长度*/
            dirty, bounds = comp.getClientArea();
        
        dirty = this.isDirty();
        
        /*暂时初始化layoutdata*/
        for (let [index, elem] of children.entries()) {
            if (elem.layoutData) {
                dirty = dirty | elem.layoutData.isDirty() | !(index == elem.layoutData.sequence);
                continue;
            }

            elem.layoutData = new gridData({
                horizontalAlignment: center,
                verticalAlignment: center,
                widthHint: elem.model.props.bounds[2],
                heightHint: elem.model.props.bounds[3]
            })
            elem.layoutData.sequence = index;
            dirty = true;
        }
        
        dirty = dirty | arg.height != bounds[3] | arg.width != bounds[2];
        
        /*拦截计算*/
        if (!dirty) return;
        
        arg.height = bounds[3];
        arg.width = bounds[2];
        
        /*计算控件分布*/
        var grid = this.computeGrid(children),
            widthList = this.computeLengthList(true, grid), 
            heightList = this.computeLengthList(false, grid);
        
        //获取参数
        var columnCount = arg.numColumns, rowCount = arg.numRows;
        
        var x = arg.marginLeft, y = arg.marginTop, item;
        
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
        
        tempMap.forEach((value, key) => {
            key.setBounds(key.layoutData.compute(value.size, value.location))
            v.refreshModel(key, key.bounds)
        });
    },
    
    computeGrid(children) {
        var {max, min} = Math;
        
        var row = 0, column = 0, rowCount = 0, columnCount = this.argumentData.numColumns,
            grid = [];
        
        var hSpan, vSpan, endCount;
        
        for (let [index, child] of children.entries()) {
            hSpan = max(1, min(child.layoutData.horizontalSpan, columnCount));
            vSpan = max(1, child.layoutData.verticalSpan);
            
            //寻找足够大的区域
            while (true) {
                if (grid[row] == null) {
                    grid[row] = new Array(columnCount);
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
                    grid[row + j] = new Array(columnCount);
                }
                
                grid[row + j].fill(child, column, column + hSpan);
            }
            
            rowCount = max (rowCount, row + vSpan);
            column += hSpan;
        }
        
        this.argumentData.numRows = rowCount;
        return grid;
    },
    
    computeLengthList(isHorizontal, grid) {
        /*初始化*/
        var arg = this.argumentData, column, row, equal, spacing ,length, columnSpan, rowSpan, hint, getCell, autoAdapt;
        if (isHorizontal) {
            column = arg.numColumns;
            row = arg.numRows;
            equal = arg.makeColumnsEqualWidth;
            spacing = arg.horizontalSpacing;
            length = arg.width - spacing*(column - 1) - (arg.marginLeft + arg.marginRight);
            columnSpan = "horizontalSpan";
            rowSpan = "verticalSpan";
            hint = "widthHint";
            getCell = (x, y) => grid[x][y];
            autoAdapt = arg.horizontalAutoAdapt
        } else {
            column = arg.numRows;
            row = arg.numColumns;
            equal = arg.makeRowsEqualHeight;
            spacing = arg.verticalSpacing;
            length = arg.height - spacing*(column - 1) - (arg.marginTop + arg.marginBottom);
            columnSpan = "verticalSpan";
            rowSpan = "horizontalSpan";
            hint = "heightHint";
            getCell = (x, y) => grid[y][x];
            autoAdapt = arg.verticalAutoAdapt
        }
        
        var lengthList = new Array(column);
        
        lengthList.fill(0);
        
        var data, cSpan;
        var {max, min} = Math;
        
        /*计算单位距离单占据最大长度*/
        for (var i = 0; i < column; i++) {
            for (var j = 0; j < row; j++) {
                
                if (getCell(j, i) == null) continue;
                
                data = getCell(j, i).layoutData;
                cSpan = max(1, min(data[columnSpan], column));
                
                if (cSpan == 1) {
                    lengthList[i] = max(lengthList[i], data[hint]);
                }
            }
        }
        
        /*多占据*/
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < column; j++) {
                
                if (getCell(i, j) == null) continue;
                
                data = getCell(i, j).layoutData;
                cSpan = max(1, min(data[columnSpan], column));
                
                if (cSpan <= 1) continue;
                
                for (var k = j; k < j + cSpan - 1; k++) {
                    lengthList[k] = max(data[hint], lengthList[k]);
                }
                
                j += cSpan - 1;
            }
        }
        
        var total = lengthList.reduce((prev, next) => prev + next);
        
        /*单位距离都相等*/
        if (equal) {
            var cellLenght = ~~(length / column),
                maxLength = lengthList.reduce((prev, next) => max(prev, next));
            
            lengthList.fill(autoAdapt ? cellLenght : min(maxLength, cellLenght));
            
            return lengthList;
        }
        
        if (total > length || autoAdapt) {
            lengthList.forEach((item, index, input) => {input[index] = item*length/total})
        }
         
        return lengthList;
    }
});




$AG.Layout = {
    FILL : fillLayout,
    GRID: gridLayout
}


export {$AG}