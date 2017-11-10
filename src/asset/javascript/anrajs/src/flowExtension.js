import {$AG} from './anra.flow'
import Base from '../lib/Base'
import {anra} from './anra.gef'
import * as constants from './anra.constants'
import {ReaderListener} from './smoothRouter'
import {Map} from './anra.common'
import {defaultsDeep} from 'lodash'

/*用于参数忽略的时候*/
function throwIfMissing() {
    throw new Error('Missing parameter');
}

$AG.EditPartListener = anra.gef.EditPartListener;

$AG.SetPropsCommand = anra.Command.extend({
    constructor(key, value, model) {
        this.model = model;
        this.key = key;
        this.value = value;
    },
    canExecute() {
        return this.model && this.key;
    },
    execute() {
        this.modification = this.model.get(this.key);
        this.model.set(this.key, this.value);
    },
    undo() {
        this.model.set(this.key, this.modification);
    }
});

$AG.Editor.prototype.initRootEditPart = function (editPart) {
    editPart.addEditPartListener(new ReaderListener());
    editPart.config = this.config;
    editPart.addNotify();
};


//暂时性
$AG.Editor.prototype.createID = function() {
    let arr =Object.keys(this.rootModel.children)
        .map((item) => parseInt(item))
        .sort((pre, next) => pre - next);
    for (let [index, id] of arr.entries()) {
        if (id == index + 1) continue;
        return index + 1;
    }

    return arr.length + 1;
};

$AG.Editor.prototype.createNodeWithPalette = function(data = throwIfMissing()) {
    let editor = this, tool = new anra.gef.CreationTool();

    return function () {
        let node = new $AG.Node();
        node.props = defaultsDeep({}, {
            id: editor.createID(),
            bounds: [0, 0, data.size[0], data.size[1]],
        }, data);
        tool.model = node;

        editor.setActiveTool(tool);
        return true;
    }
};

$AG.Editor.prototype.getSaveData = function (...attrNameArr) {
    let nodeStore = this.store.node;

    /*遍历DB所有record, 筛选属性数据*/
    return attrNameArr.length > 0 ? nodeStore().select(...attrNameArr).map((item) =>
        item.reduce((pre, next, index) => Object.assign(pre, {[attrNameArr[index]]: next}), {})
    ) : nodeStore().map((record) => ({
        ...record,
        bounds: undefined,
        id: undefined,
        type: undefined,
        size: undefined,
        '___id': undefined,
        '___s': undefined,
    }))
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

const Circle = anra.svg.Control.extend(anra.svg.Circle);
/*可以验证连线的ConnectionPolicy扩展*/
let validatorConnectionExtend = {
    validators: new Map().
    set('type', (value, {type}) => {
        if (value == 'out') {
            return constants.REQ_RECONNECT_SOURCE ==type || type == constants.REQ_CONNECTION_START;
        }

        if (value == 'in') {
            return constants.REQ_RECONNECT_TARGET == type || type == constants.REQ_CONNECTION_END;
        }

        //TODO
        throw "";
    }).
    set('max', (value, {sourceLines, targetLines, type, source, target, current}) => {

        if (type == constants.REQ_RECONNECT_TARGET &&
            target.editPart == current.editPart &&
            target.anchor.id == current.anchor.id) {
            return true;
        }

        if (type == constants.REQ_RECONNECT_SOURCE &&
            source.editPart == current.editPart &&
            source.anchor.id == current.anchor.id) {
            return true;
        }


        if (sourceLines.length + targetLines.length < value) return true;

        if (sourceLines.length + targetLines.length > value) return false;

        sourceLines.forEach(({target, source}) => {
            if (target == source) return true;
        });
    }).
    set('linkmyself', (value, {type, source, target, current}) =>{
        if (value === true || constants.REQ_CONNECTION_START == type) return true;

        if (constants.REQ_CONNECTION_END == type || constants.REQ_RECONNECT_TARGET == type) {
            return current.editPart !== source.editPart;
        }

        if (constants.REQ_RECONNECT_SOURCE == type) {
            return current.editPart !== target.editPart;
        }
    }).
    set('validator', (value, host) => {
        if (value instanceof Function) {
            return value(host) === true;
        }

        //TODO
        throw "";
    }),
    showSourceFeedback(req) {
        if (constants.REQ_CONNECTION_START == req.type || constants.REQ_RECONNECT_SOURCE == req.type) {
            var anchor = this.getHost().getSourceAnchor(req);
            this.refreshSourceAnchorFeedback(anchor, req);
        } else if (constants.REQ_CONNECTION_MOD == req.type) {
            this.showAnchors(req);
        }
    },
    showTargetFeedback(req) {
        if (constants.REQ_RECONNECT_TARGET == req.type || constants.REQ_CONNECTION_END == req.type) {
            var anchor = this.getHost().getTargetAnchor(req);
            this.refreshTargetAnchorFeedback(anchor, req);
        }
    },
    refreshSourceAnchorFeedback(anchor, req) {
        if (this.sourceAnchor == null) {
            this.sourceAnchor = this.createSourceAnchorFeedback();
            this.addFeedback(this.sourceAnchor);
        }

        this.validatorAnchor(anchor, req) ? this.setFeedbackAvailable(this.sourceAnchor) : this.setFeedbackInvalid(this.sourceAnchor);

        if (anchor) {
            this.sourceAnchor.setBounds({x: anchor.x, y: anchor.y, width: 15, height: 15});
        }
    },
    refreshTargetAnchorFeedback(anchor, req) {
        if (this.targetAnchorFeedback == null) {
            this.targetAnchorFeedback = this.createTargetAnchorFeedback();
            this.addFeedback(this.targetAnchorFeedback);
        }

        this.validatorAnchor(anchor, req) ? this.setFeedbackAvailable(this.targetAnchorFeedback) : this.setFeedbackInvalid(this.targetAnchorFeedback);

        this.targetAnchorFeedback.setBounds({x: anchor.x, y: anchor.y, width: 15, height: 15});
    },
    eraseTargetFeedback(req) {
        if (this.targetAnchorFeedback) {
            this.removeFeedback(this.targetAnchorFeedback);
            this.targetAnchorFeedback = null;
        }
    },
    validatorAnchor(anchor, req) {
        let enable = true, host = this.getHost();

        let sourceLines = host.getModelSourceLines().map(model => model.props).filter(({exit}) => exit == anchor.id),
            targetLines = host.getModelTargetLines().map(model => model.props).filter(({entr}) => entr == anchor.id),
            source = null,
            target = null,
            current = null;

        if (constants.REQ_CONNECTION_END == req.type) {
            source = {
                editPart: req.target.sourceEditPart,
                anchor: req.target.sourceAnchor,
            }
        } else if (constants.REQ_RECONNECT_SOURCE == req.type || constants.REQ_RECONNECT_TARGET == req.type) {
            source = {
                editPart: req.target.linePart.source,
                anchor: req.target.linePart.getSourceAnchor(),
            }

            target = {
                editPart: req.target.linePart.target,
                anchor:  req.target.linePart.getTargetAnchor(),
            }
        }

        current = {
            editPart: host,
            anchor: anchor
        }



        for (let [key, value] of Object.entries(anchor)) {
            if (this.validators.has(key)) {
                enable &= this.validators.get(key)(value, {
                    sourceLines,
                    targetLines,
                    type: req.type,
                    current,
                    source,
                    target,
                });
            }
        }

        return enable;
    },
    setFeedbackAvailable(feedback) {
        feedback.setAttribute({
            'stroke': 'green',
        });
        this.getHost().getFigure().owner.style.cursor = 'pointer';
        this.isInvalid = false;
    },
    setFeedbackInvalid(feedback) {
        feedback.setAttribute({
            'stroke': 'red',
        });
        this.getHost().getFigure().owner.style.cursor = 'not-allowed';
        this.isInvalid = true;
    },
    eraseSourceFeedback: function (req) {
        if (constants.REQ_CONNECTION_MOD == req.type) {
            this.eraseAnchors(req);
        }
        if (this.sourceAnchor != null) {
            this.getHost().getFigure().selectionChanged(constants.SELECTED_NONE);
            this.getFeedbackLayer().removeChild(this.sourceAnchor);
            this.sourceAnchor = null;
        }
    },
    getCreateConnectionCommand: function (req) {
        if (this.isInvalid) return null;

        return Reflect.apply(anra.gef.ConnectionPolicy.prototype.getCreateConnectionCommand, this, Array.of(req));
    },
    createTargetAnchorFeedback() {
        var rect = new Circle();
        rect.setAttribute({
            'fill-opacity': 0,
            'stroke-opacity': 0.8,
            'stroke': 'green',
            'stroke-width': 5,
        });
        return rect;
    },
    getConnectionCompleteCommand(req) {
        if (this.isInvalid) return null;

        return Reflect.apply(anra.gef.ConnectionPolicy.prototype.getConnectionCompleteCommand, this, Array.of(req));
    },
    getReconnectTargetCommand(req) {
        if (this.isInvalid) return null;

        return Reflect.apply(anra.gef.ConnectionPolicy.prototype.getReconnectTargetCommand, this, Array.of(req));
    },
    getReconnectSourceCommand(req) {
        if (this.isInvalid) return null;

        return Reflect.apply(anra.gef.ConnectionPolicy.prototype.getReconnectSourceCommand, this, Array.of(req));
    }
};

$AG.ConnectionPolicy = $AG.ConnectionPolicy.extend(validatorConnectionExtend);


/***************关于布局****************/
var Layout = Base.extend({
    layout(comp) {
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
                    /*todo*/
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
                    /*todo*/
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
    constructor: function({ numColumns = 10, numRows, makeColumnsEqualWidth = true, makeRowsEqualHeight = true,
                              marginLeft = 2, marginTop = 2, marginRight = 2, marginBottom = 2, horizontalSpacing = 15,
                              verticalSpacing = 15, width = 0, height = 0, autoAdapt = false} = {}) {
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
            autoAdapt
        };
        var v = this, dirty = false;

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

                get: function() {
                    return argumentData[attributeName];
                },
                enumerable: true,
                configurable: false
            }))(key);
        }
        Object.defineProperties(v.arg, descriptors)

        /*只读*/
        this.isDirty = () => dirty;

        /*dirty状态在layout后刷新*/
        this.layout = (comp) => {
            v._layout();
            dirty = false;
        }
    },

    _layout(comp) {
        if (comp.children == null || (comp.children instanceof Array && comp.children.length < 1)) {
            return;
        }

        var children = comp.children, arg = this.argumentData,
            /*layout参数、data参数、children顺序、长度*/
            dirty;

        dirty = this.isDirty();

        /*暂时初始化layoutdata*/
        for (let [index, elem] of children.entries()) {
            if (elem.layoutData) {
                dirty = dirty | elem.layoutData.dirty | !(index == elem.layoutData.sequence);
                continue;
            }

            elem.layoutData = new gridData(elem.model.props.bounds[2], elem.model.props.bounds[3]);
            elem.layoutData.sequence = i;
            dirty = true;
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
            grid = [[]];

        var hSpan, vSpan, endCount;

        for (let [index, child] of children.entries()) {
            hSpan = max(1, min(child.layoutData.horizontalSpan, columnCount));
            vSpan = max(1, child.layoutData.verticalSpan);

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

                grid[row + j].fill(child, column, column + hSpan - 1);
            }

            rowCount = max (rowCount, row + vSpan);
            column += hSpan;
        }

        this.arg.numRows = rowCount;
        return grid;
    },

    computeLengthList(isHorizontal, grid) {
        /*初始化*/
        var arg = this.argumentData, column, row, equal, spacing ,length, columnSpan, rowSpan, hint, getCell;
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

            lengthList.fill(arg.autoAdapt ? cellLenght : min(maxLength, cellLenght));

            return lengthList;
        }

        if (total > length || arg.autoAdapt) {
            lengthList.forEach((item, index, input) => {input[index] = item*length/total})
        }

        return lengthList;
    }
});

anra.svg.Image.layoutManager = new fillLayout();

export {$AG}