import {anra} from './anra.gef'

/*需要的常量*/
const inOpen = 1 << 1;
const inClosed = 1 << 2;
const notFound = 1 << 3;
const forward = 1 << 4;
const backward = 1 << 5;
const RE = 10;
const BE = 14;
const coefficient = 2.5;
const dir = [[0, -1], [-1, 0], [0, 1], [1, 0]];
const LEFT = {x: -1, y: 0};
const RIGHT = {x: 1, y: 0};
const UP = {x: 0, y: -1};
const DOWN = {x:0, y: 1};

function throwIfMissing() {
  throw new Error('Missing parameter');
}

function getSourceNormal(line = throwIfMissing()) {
    let source = line.getStartPoint();

    if (line.model.sourceNode) {
        return getDirection(line.model.sourceNode.get('bounds'), source);
    }

    let target = line.getEndPoint(), offsetX = source.x - target.x, offsetY = source.y - target.y;

    return Math.abs(offsetX) > Math.abs(offsetY) ? {x: offsetX/Math.max(1, Math.abs(offsetX)), y: 0} : {x: 0, y: offsetY/Math.max(1, Math.abs(offsetY))};
}

function getTargetNormal(line = throwIfMissing()) {
    let target = line.getEndPoint();

    if (line.model.targetNode) {
        return getDirection(line.model.targetNode.get('bounds'), target);
    }

    let source = line.getStartPoint(), offsetX = target.x - source.x, offsetY = target.y - source.y;

    return Math.abs(offsetX) > Math.abs(offsetY) ? {x: offsetX/Math.max(1, Math.abs(offsetX)), y: 0} : {x: 0, y: offsetY/Math.max(1, Math.abs(offsetY))};
}

/**
 * 路由主体
 */
const route = function(line, reader = throwIfMissing()) {
    if (line.points === null || line.points.length < 2) {
        return null;
    }
    
    let source = line.getStartPoint(), 
        target = line.getEndPoint();
    
    /*连线的过程中*/
    if (!line.hasOwnProperty('model')) {
        return ManhattanPath(source, target);
    }
    
    let sourceBlock = reader.absoluteToRelative(source),
        targetBlock = reader.absoluteToRelative(target);
    
    /*抽象寻路大致路径*/
    let path = search(sourceBlock, targetBlock, reader, line);
    
    /*平滑绝对路径*/
    path = optimizePath(path, line, reader);
    
    return path || [source, target];
};

/*搜索大致路径的部分*/
const search = function(start, end, reader, line) {
    //无法到达的情况下，仅仅处理相邻，暂时不包括斜角相邻
    let pos = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    
    switch(pos) {
        case 0:
            return [start];
        case 1:
            return [start, end];
        default:
            return doubleAS.finding(start, end, reader, line).getPath();
    }
};


/*关于寻路算法的部分*/
const doubleAS = {

    addOpenList(source, target, open, direction) {
        source.state = inOpen | direction;
        source.f = source.g + (Math.abs(source.x - target.x) + Math.abs(source.y - target.y)) * (source.count === 0 ? RE : RE * coefficient);
        this.insertByBinarySort(source, open);
    },

    removeFromOpen(point, open) {
        if (point.newG >= point.g)
            return;

        for (let [index, elem] of open.entries()) {
            if (point === elem) {
                open.splice(index, 1);
                point.g = point.newG;
                point.state = notFound;
                return;
            }
        }
    },

    getMinPoint(list) {
        let p = list.pop();
        p.state = (p.state - inOpen) | inClosed;

        return p;
    },

    isMeet(point, direction) {
        return (point.state & direction) !== direction && (point.state & notFound) !== notFound;
    },

    calculatePath(node) {
        if (node === null) {
            return [];
        }

        let nodes = [];

        while (node.parent) {
            nodes.unshift(node);
            node = node.parent;
        }
        nodes.unshift(node);

        return nodes
    },

    insertByBinarySort(node, list) {
        let high = list.length - 1,
            low = 0,
            mid;

        if (high < 0) {
            list.push(node);
            return;
        }

        while (low <= high) {
            mid = ~~((high + low) / 2);

            if (list[mid].f > node.f) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        list.splice(low, 0, node);
    },

    finding(start, end, reader, line) {
        let list = [],
            blist = [],
            current, bcurrent;

        this.reset(start, end, reader, line);
        this.addOpenList(start, end, list, forward);
        this.addOpenList(end, start, blist, backward);

        while (list.length * blist.length > 0) {
            current = this.getMinPoint(list);
            bcurrent = this.getMinPoint(blist);

            if (this.flag = this.search(current, end, list, forward, reader)) {
                break;
            }

            if (this.flag = this.search(bcurrent, start, blist, backward, reader)) {
                break;
            }
        }

        return this;
    },

    getPath() {

        return this.flag ? this.calculatePath(this.forwardPoint).concat(this.calculatePath(this.backwardPoint).reverse()) : null;
    },

    reset(start, end, reader, line) {
        this.pool = new Map();

        if (line) {
            //
            let startNormal = getSourceNormal(line),
                endNormal = getTargetNormal(line);

            //反向映射字典
            start.dir = Math.abs(2 * startNormal.x + startNormal.y + 1);
            end.dir = Math.abs(2 * endNormal.x + endNormal.y + 　1);

        } else {
            start.dir = 0;
            end.dir = 0;
        }

        this.pool.set(start.x + '_' + start.y, start);
        this.pool.set(end.x + '_' + end.y, end);

        reader.structure();
        this.flag = false;

    },

    getNeighbors(point = throwIfMissing(), reader) {
        let result = [],
            x, y,
            pool = this.pool,
            key, index, d = point.dir,
            count;


        for (let i = 0; i < 4; i++) {
            index = (d + i) % 4;
            x = point.x + dir[index][0];
            y = point.y + dir[index][1];
            count = reader.getCount(x, y);

            if (count !== -1) {
                key = x + '_' + y;

                if (!pool.has(key)) {
                    pool.set(key, {
                        x: x,
                        y: y,
                        state: notFound,
                        count: count
                    });
                }

                pool.get(key).dir = index;
                result.unshift(pool.get(key));
            }
        }

        return result;
    },

    calculateG(node, srnode) {
        let g, srg = srnode.g;

        //计算node到srnode的距离
        if (this.hasOwnProperty("diagonal") && this.diagonal) {
            g = (node.x !== srnode.x && node.y !== srnode.y ? BE : RE);
        } else {
            g = node.count === 0 ? RE : RE * coefficient;
        }

        g += srnode.hasOwnProperty('g') ? srg : 0;

        if (node.hasOwnProperty('g')) {
            node.newG = g;
        } else {
            node.g = g;
        }
    },

    search(point, target, open, direction, reader) {
        let neighbors = this.getNeighbors(point, reader),
            temp;

        while (temp = neighbors.pop()) {
            this.calculateG(temp, point);

            if (this.isMeet(temp, direction)) {
                let bestPoint = temp;
                if (temp.count > 0) {
                    neighbors.forEach((item) => {
                        if (this.isMeet(item, direction) &&
                            item.count < bestPoint.count) {
                            bestPoint = item;
                        }
                    });
                }

                if (direction === forward) {
                    this.forwardPoint = point;
                    this.backwardPoint = bestPoint;
                } else {
                    this.forwardPoint = bestPoint;
                    this.backwardPoint = point;
                }

                return true;
            }

            if ((temp.state & inClosed) === inClosed) {
                continue;
            }

            if ((temp.state & inOpen) === inOpen) {
                this.removeFromOpen(temp, open);
            }

            if ((temp.state & notFound) === notFound) {
                temp.parent = point;
                this.addOpenList(temp, target, open, direction);
            }
        }
        return false;
    }
}



/*关于路径优化的部分*/
const optimizePath = function(path, line, reader) {
    if (path === null) return null;
    
    /*去共点*/
    removeCollinearPoint(path);
    
    /*转成绝对路径*/
    path = reader.relativeToAbsolute(path);
    
    /*平滑处理*/
    return smoothStrategy.smooth(path.length)(path, line, reader);
};

const removeCollinearPoint = function(path = throwIfMissing()) {
    let i = 0;
    
    while (i < path.length - 2) {
        if ((path[i + 1].x === path[i].x && path[i].x === path[i + 2].x) ||
            (path[i + 1].y === path[i].y && path[i].y === path[i + 2].y)) {
            path.splice(i + 1, 1);
        } else {
            i++;
        }
    }
};

let smoothStrategy = {
    smooth(length) {
        switch (length) {
            case 1:
                return this.oneNodeStrategy;
            case 2:
                return this.twoNodeStrategy;
            default:
                return this.moreNodeStrategy;
        }
    },
    oneNodeStrategy(path, line, reader) {
        let source = line.getStartPoint(),
            target = line.getEndPoint();

        /*共线*/
        if ((source.x - target.x) * (source.y - target.y) === 0) {
            return [source, target];
        }

        let sourceNormal = getSourceNormal(line),
            targetNormal = getTargetNormal(line),
            vector = getVector(target, source),
            bendPoint;

        /*根据向量情况选取拐点*/
        if (dotProduct(sourceNormal, vector) > 0) {
            bendPoint = sourceNormal.x*vector.x > 0 ? {x: target.x, y: source.y} : {x: source.x, y: target.y};
        } else if (dotProduct(targetNormal, vector) < 0) {
            bendPoint = targetNormal.x*vector.x < 0 ? {x: source.x, y: target.y} : {x: target.x, y: source.y};
        }
        /*依据距离选择*/
        else {
            bendPoint = Math.abs(source.x - target.x) > Math.abs(source.y - target.y) ? {x: target.x, y: source.y} : {x: source.x, y: target.y};
        }


       return [source, bendPoint, target];
    },
    twoNodeStrategy(path, line, reader) {
        let s = line.getStartPoint(),
            e = line.getEndPoint();

        //共线的情况
        if ((s.x - e.x) * (s.y - e.y) === 0) {
            return [s, e];
        }

        //方向参考
        let startNormal = getSourceNormal(line),
            endNormal = getTargetNormal(line),
            abs_dir = getVector(e, s),
            rel_dir = {
                x: path[1].x - path[0].x,
                y: path[1].y - path[0].y
            },
            horizontal = rel_dir.x === 0 ? 0 : 1;

        //数学函数
        let {abs} = Math;

        let result = [],
            /*coff:中点选择参数, p1,p2:中点*/
            coff, p1, p2;


        //垂直情况下
        if (dotProduct(startNormal, endNormal) === 0) {

            //确定与路径方向在一水平线上的点，并如果出现路径方向与Normal相反的情况，统一同向
            //与路径方向在一水平上的为参照点
            //coff大于0，说明参照点在另一点normal方向上正向偏移，反之为负向偏移
            //根据两点的相对位置选择拐点
            if (abs(dotProduct(startNormal, rel_dir)) === 1) {
                startNormal.x = rel_dir.x;
                startNormal.y = rel_dir.y;

                coff = (horizontal * (s.y - e.y) + (1 - horizontal) * (s.x - e.x)) * (endNormal.x + endNormal.y);
                //coff = max(0, coff/abs(coff));// 
                coff = coff === 1 ? 1 : 0;
            } else {

                endNormal.x = 0 - rel_dir.x;
                endNormal.y = 0 - rel_dir.y;

                coff = (horizontal * (e.y - s.y) + (1 - horizontal) * (e.x - s.x)) * (startNormal.x + startNormal.y);

                //coff = abs(min(0, coff/abs(coff)));// 
                coff = coff === 1 ? 0 : 1;
            }

            result = [s, {
                x: (1 - coff) * e.x + coff * s.x,
                y: (1 - coff) * s.y + coff * e.y
            }, e];
            //result = [s, {x:(1 - horizontal)*s.x + horizontal*e.x, y: horizontal*s.y + (1 - horizontal)*e.y}, e];
        }

        //平行的情况下
        else {
            //同向情况
            if (dotProduct(startNormal, endNormal) === 1) {
                // ↑ ↑
                if (dotProduct(startNormal, rel_dir) === 0) {
                    p1 = similarity(s, startNormal, path[0], reader); //
                    p2 = similarity(e, endNormal, path[1], reader);
                    abs_dir = getVector(p2, p1);

                    if (dotProduct(startNormal, abs_dir) > 0) {
                        result = [s, {
                            x: horizontal * s.x + 　(1 - horizontal) * p2.x,
                            y: (1 - horizontal) * s.y + horizontal * p2.y
                        }, p2, e];
                    } else {
                        result = [s, p1, {
                            x: horizontal * e.x + (1 - horizontal) * p1.x,
                            y: (1 - horizontal) * e.y + horizontal * p1.y
                        }, e];
                    }
                }

                // ← ←
                else {
                    //取方向上的拐点

                    //coff大于0，说明方向上，起点在终点前面，反之
                    coff = ((1 - horizontal) * (s.x - e.x) + 　horizontal * (s.y - e.y)) * (rel_dir.x + rel_dir.y);
                    coff = coff > 0 ? 1 : 0;

                    result = [s, {
                        x: coff * s.x + (1 - coff) * e.x,
                        y: coff * e.y + (1 - coff) * s.y
                    }, e];
                }
            }

            //反向情况
            else {
                //选择间隙更大的中点
                result = ManhattanPath(s, e);
            }

        }

        return result;
    },
    moreNodeStrategy (path, line, reader) {
        let result = [], l = path.length;
        let s = line.getStartPoint(), e = line.getEndPoint(),
            
            sx = s.x - path[0].x, sy = s.y - path[0].y,
            
            i = 0, {abs, min} = Math,
            
            startNode = reader.absoluteToRelative(s),
            endNode = reader.absoluteToRelative(e),
            
            startNormal = getSourceNormal(line),
            endNormal = getTargetNormal(line),
            
            start, end = e;
        
        if (dotProduct(startNormal, getVector(path[1], path[0])) === 0) {
            start = similarity(s, startNormal, startNode, reader);
            sx = start.x - path[0].x;
            sy = start.y - path[0].y;
        }
        
        if (dotProduct(endNormal, getVector(path[l - 2], path[l - 1])) === 0) {
            end = similarity(e, endNormal, endNode, reader);
        }
        
        for (; i < l - 2; i++) {
            result.push({x: path[i].x + sx, y: path[i].y + sy});
        }
        
        let sf = min(1, abs(path[i - 1].x - path[i].x)), ef = min(1, abs(path[i + 1].x - path[i].x));
        
        result.push({x: ef*result[i - 1].x + sf*end.x,
                     y: sf*result[i - 1].y + ef*end.y});
        
        result.push(end);
            
        if (start && (start.x !== s.x || start.y !== s.y)) {
            result.unshift(s);
        }
            
        if (end && (end.x !== e.x || end.y !== e.y)) {
            result.push(e);
        }
        
        return result;
    }
};

/*简单路径方式*/
const ManhattanPath = function(start = throwIfMissing(), end = throwIfMissing()) {
    let {abs} = Math, p1, p2;
    if (abs(start.x - end.x) > abs(start.y - end.y)) {
        p1 = {x: (start.x + end.x)/2, y: start.y};
        p2 = {x: (start.x + end.x)/2, y: end.y};
    } else {
        p1 = {x: start.x, y: (start.y + end.y)/2};
        p2 = {x: end.x, y: (start.y + end.y)/2};
    }
            
    return [start, p1, p2, end];
};


/*计算向量*/
const getVector = function(p1, p2) {
    let {abs, max} = Math;
    return {x: (p1.x - p2.x)/max(1, abs(p1.x - p2.x)),
            y: (p1.y - p2.y)/max(1, abs(p1.y - p2.y))};
};

/*叉乘*/
const dotProduct = function(r1, r2) {
    return r1.x*r2.x + r1.y*r2.y;
};

const similarity = function(point, direction, node, reader) {
    let boundary, abs = Math.abs, max = Math.max, horizontal = abs(direction.x), gap;
    
    boundary = horizontal*(node.x + max(0, direction.x)) + (1 - horizontal)*(node.y + max(0, direction.y));
    boundary *= reader.w;
    
    gap = direction.x*(boundary - point.x) + direction.y*(boundary - point.y);

    return gap >= 10 ? {x: point.x + 10*direction.x, y: point.y + 10*direction.y} : point;
};

const getDirection = function([bx, by, width, height], {x: px, y: py}) {
    let i, right = bx + width, bottom = by + height,
        direction = {x:LEFT.x, y:LEFT.y}, abs = Math.abs, distance = abs(bx - px);
    
    i = abs(by - py);
    if (i <= distance) {
        distance = i;
        direction = {
            x: UP.x,
            y: UP.y
        };
    }
    
    i = abs(bottom - py);
    if (i <= distance) {
        distance = i;
        direction = {
            x: DOWN.x,
            y: DOWN.y
        };
    }
    
    i = abs(right - px);
    if (i < distance) {
        direction = {
            x: RIGHT.x,
            y: RIGHT.y
        };
    }
    
    return direction;
};


/*监听器部分*/
let ReaderListener = anra.gef.EditPartListener.extend({
    partActivated (editPart) {
        editPart.getReader = (function () {
            let reader = null;
            return function () {
                if (!reader) {
                    reader = new Reader();
                }
                return reader;
            }
        })();
    },

    partDeactivated (editPart) {
        delete editPart.getReader;
    },

    childAdded (child) {
        // toadd 父子
        if (child instanceof anra.gef.NodeEditPart) {
            let root = child.getRoot();
            root.getReader().read(child);
            this.on(child);
        }
    },

    removingChild (child) {
        if (child instanceof anra.gef.NodeEditPart) {
            child.getRoot().getReader().remove(child);
        }
    },

    on (editPart) {
        let model, oldBounds, reader, newBounds;

        model = editPart.model;
        oldBounds = model.get('bounds').map((item) => item);
        reader = editPart.getRoot().getReader();

        model.addPropertyListener(function () {
            newBounds = model.get('bounds').map((item) => item);
            reader.change(newBounds, oldBounds);
            oldBounds = newBounds.map((item) => item);
        }, 'bounds');
    }
});


/*预读器部分*/
class Reader {
    constructor() {
        this.struct = new Map();

        this._addList = [];
        this._deleteList = [];

        //暂时
        this.w = 15;
        this.maxWidth = 100;
        this.maxHeight = 100;
    }

    read (editPart) {
        if (!(editPart instanceof anra.gef.NodeEditPart)) {
            return;
        }

        let list = this._addList;

        if (editPart instanceof anra.gef.RootEditPart) {
            editPart.children.forEach((item) => {
                list.push(item.model.get('bounds').map((item) => item));
            });
        } else {
            list.push(editPart.model.get('bounds').map((item) => item));
        }
    }

    remove (editPart) {
        if (editPart instanceof anra.gef.RootEditPart) {
            this.clear();
            return;
        }

        if (editPart instanceof anra.gef.NodeEditPart) {
            this._deleteList.push(editPart.model.get('bounds').map((item) => item));
        }
    }

    change (newBounds, oldBounds) {
        this._addList.push(newBounds);
        this._deleteList.push(oldBounds);
    }

    structure () {
        if((this._addList.length + this._deleteList.length) === 0) {
            return;
        }

        //先处理增加Bounds
        this._addList.forEach((item) => {
            this.process(item, 1)
        });

        //处理删减的Bounds
        this._deleteList.forEach((item) => {
            this.process(item, -1)
        });

        this._addList = [];
        this._deleteList = [];
    }

    process (bounds, unit) {
        let w = this.w,
            relative_sx = ~~(bounds[0] / w),
            relative_sy = ~~(bounds[1] / w),
            relative_ex = Math.ceil((bounds[0] + bounds[2]) / w),
            relative_ey = Math.ceil((bounds[1] + bounds[3]) / w), key;

        for (let i = relative_sx; i < relative_ex; i++) {
            for (let j = relative_sy; j < relative_ey; j++) {
                key = i + '_' + j;

                if (!this.struct.has(key)) {
                    this.struct.set(key, {
                        count: 0
                    });
                }

                this.struct.get(key).count += unit;

                //添加一个删除节点的操作
                if (this.struct.get(key).count === 0) {
                    this.struct.delete(key);
                }
            }
        }
    }

    isValid (x, y) {
        return !(x < -1 || x > this.maxWidth || y < -1 || y > this.maxHeight);
    }

    isObstacle (x, y) {
        if (!this.isValid(x, y)) {
            return true;
        }

        if (!this.struct.has(x + '_' + y)) {
            return false;
        }

        return this.struct.get(x + '_' + y).count !== 0;
    }

    //返回节点覆盖次数
    getCount (x, y) {
        if (!this.isValid(x, y)) {
            return -1;
        }

        let key = x + '_' + y;
        return this.struct.has(key) ? this.struct.get(key).count : 0;
    }


    absoluteToRelative (points) {
        let width = this.w;

        return points instanceof Array ? points.map(({x, y}) => ({
            x: ~~(x / width),
            y: ~~(y / width)
        })) : {x: ~~(points.x / width), y: ~~(points.y / width)};
    }


    relativeToAbsolute (points = throwIfMissing()) {

        let width = this.w;

        return points instanceof Array ? points.map(({x, y}) => ({x: x * width, y: y * width })) : {x: points.x * width, y: points.y * width};
    }

    clear () {
        this.struct.clear();

        this._addList = [];
        this._deleteList = [];
    }

}

export {ReaderListener}

/**
 * 
 * 
 *
 */
export default function createRouter() {
    return (line, reader)  => route(line, reader);
}