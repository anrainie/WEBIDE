import {Map, Util} from './anra.common'
import Base from '../lib/Base'
import {anra} from './anra.gef'

/**
 * 路由主体
 */
var smoothRouter = {
    route : function(line, reader) {
        if (line.points == null || line.points.length < 2) {
            return null;
        }
        
        //适应框架本身的BUG
        if (!line.hasOwnProperty('model')) {
            return [line.getStartPoint(), line.getEndPoint()];
        }
        
        var path, start = reader.absoluteToRelative(line.getStartPoint()),
            end = reader.absoluteToRelative(line.getEndPoint());
        
        
        //搜索大致路径
        path = search(start, end, reader, line);
        
        
        if (path) {
            var i = 0, length = path.length;
            
            while (i < length - 2) {
                if ((path[i + 1].x == path[i].x && path[i].x == path[i + 2].x) || (path[i + 1].y == path[i].y && path[i].y == path[i + 2].y)) {
                    //path.removeObject(path[i + 1]);
                    Util.removeObject.call(path, path[i + 1]);
                    length = path.length;
                } else {
                    i++;
                }
            }
            
            
            path.forEach(function(item, index, input) {
               input[index] = reader.relativeToAbsolute(item);
            });
            
            return optimize(path, line, reader);
        }
        
        return [line.getStartPoint(), line.getEndPoint()];
    }
};

/*搜索大致路径的部分*/
var search = function(start, end, reader, line) {
    //无法到达的情况下，仅仅处理相邻，暂时不包括斜角相邻
    var pos = Math.abs(start.x - end.x) + Math.abs(start.y - end.y), path;
    
    if (pos == 0) {
        path = [start];
    } else if (pos == 1) {
        path = [start, end];
    } else {
        doubleAS.finding(start, end, reader, line);
        path = doubleAS.getPath();
    }
    return path;
}


/*关于寻路算法的部分*/

const inOpen = 1 << 1;
const inClosed = 1 << 2;
const notFound = 1 << 3;
const forward = 1 << 4;
const backward = 1 << 5;

const RE = 10;
const BE = 14;
const coefficient = 2.5;

const dir = [[0, -1], [-1, 0], [0, 1], [1, 0]];

var binaryList = function(node, list) {
        var high = list.length - 1,
            low = 0,
            mid;

        if (high < 0) {
            list.push(node);
            return;
        }

        while (low <= high) {
            mid = Math.floor((high + low) / 2);

            if (list[mid].f > node.f) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        //list.insert(node, low);   
        Util.insert.call(list, node, low)
};

var calculatePath= function(node) {
    if (node == null) {
        return [];
    }

    var nodes = [];
        
    while (node.parent) {
        nodes.unshift(node);
        node = node.parent;
    }
    nodes.unshift(node);

    return nodes
}

var doubleAS = {
    finding : function(start, end, reader, line) {        
        var list = [], blist = [], current, bcurrent;
        
        this.reset(start, end, reader, line);
        this.addOpenList(start, end, list, forward);
        this.addOpenList(end, start, blist, backward);
        
        while (!Util.isEmpty.call(list) && !Util.isEmpty.call(blist)) {
            current = this.getMinPoint(list);
            bcurrent = this.getMinPoint(blist);
            
            if (this.flag = this.search(current, end, list, forward, reader)) {
                break;
            }
            
            if (this.flag = this.search(bcurrent, start, blist, backward, reader)) {
                break;
            }
        }
    },
    
    addOpenList : function(source, target, open, direction) {
        source.state = inOpen | direction;
        source.f = source.g + (Math.abs(source.x - target.x) + Math.abs(source.y - target.y))*(source.count == 0 ? RE : RE*coefficient);/*source.g;*/ /*+ (Math.abs(source.x - target.x) + Math.abs(source.y - target.y))*RE;*/
        binaryList(source, open);
    },
    
    removeFromOpen : function(point, open) {
        if (point.newG >= point.g)
            return;

        //open.removeObject(point);
        Util.removeObject.call(open, point);
        point.g = point.newG;
        point.state = notFound;
    },
    
    getMinPoint : function(list) {
        var p = list.pop();
        p.state = (p.state - inOpen) | inClosed;
        
        return p;
    },
    
    getPath : function(){
        if (this.flag) { 
            var path = calculatePath(this.forwardPoint).concat(calculatePath(this.backwardPoint).reverse());
            
            return path;
        }
        return null;
    },
    
    reset : function(start, end, reader, line) {
        this.pool = new Map();
        
        if (line) {
            var startNormal = getDirection(line.model.sourceNode.get('bounds'), line.getStartPoint()),
                endNormal = getDirection(line.model.targetNode.get('bounds'), line.getEndPoint())
            
            //反向映射字典
            start.dir = Math.abs(2*startNormal.x + startNormal.y + 1);
            end.dir = Math.abs(2*endNormal.x + endNormal.y +　1);
            
        } else {
            start.dir = 0;
            end.dir = 0;
        }
        
        this.pool.put(start.x + '_' + start.y, start);
        this.pool.put(end.x + '_' + end.y, end);
        
        reader.structure();
        this.flag = false;
        
    },
    
    getNeighbors : function(point, reader) {
        if (point == null) {
            return null;
        }

        var result = [], x = point.x, y = point.y,
            pool = this.pool, key, index, d = point.dir;
        
        
        for (var i = 0; i < 4; i++) {
                index = (d + i)%4;
                x = point.x + dir[index][0];
                y = point.y + dir[index][1];
                if (!reader.isObstacle(x, y)) {
                    key = x + '_' + y;
                    
                    if (!pool.has(key)) {
                        pool.put(key, {
                            x: x, 
                            y: y,
                            state: notFound
                        });
                    }
                    
                    pool.get(key).dir = index;
                    result.unshift(pool.get(key));
                }
            }
        return result;

    },
    
    getNeighbors1 : function(point, reader) {
        if (point == null) {
            return null;
        }

        var result = [], x, y, 
            pool = this.pool, key, index, d = point.dir, count;
        
        
        for (var i = 0; i < 4; i++) {
            index = (d + i)%4;
            x = point.x + dir[index][0];
            y = point.y + dir[index][1];
            count = reader.getCount(x, y);
            
            if (count != -1) {
                key = x + '_' + y;
                
                if (!pool.has(key)) {
                    pool.put(key, {
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
    
    calculateG: function (node, srnode) {
        var g, srg = srnode.g;

        //计算node到srnode的距离
        if (!this.diagonal) {
            g = node.count == 0 ? RE : RE*coefficient;
            //g = RE;
        } else {
            g = (node.x != srnode.x && node.y != srnode.y ? BE : RE);
        }

        g += srnode.hasOwnProperty('g') ? srg : 0;

        if (node.hasOwnProperty('g')) {
            node.newG = g;
        } else {
            node.g = g;
        }
    },
    
    search : function(point, target, open, direction, reader) {
        var neighbors = this.getNeighbors1(point, reader), temp;
        
        while (temp = neighbors.pop()) {
            this.calculateG(temp, point);
            
            if (this.isMeet(temp, direction)) {
                var bestPoint = temp, host = this;
                if (temp.count > 0) {
                    neighbors.forEach(function(item, index, input) {
                        if (host.isMeet(item, direction) &&
                            item.count < bestPoint.count) {
                            bestPoint = item;
                        }
                    });
                }
                
                if (direction == forward) {
                    this.forwardPoint = point;
                    this.backwardPoint = bestPoint;
                } else {
                    this.forwardPoint = bestPoint;
                    this.backwardPoint = point;
                }
                
                return true;
            }
            
            if ((temp.state & inClosed) == inClosed) {
                continue;
            }
            
            if ((temp.state & inOpen) == inOpen) {
                this.removeFromOpen(temp, open);
            }
            
            if ((temp.state & notFound) == notFound) {
                temp.parent = point;
                this.addOpenList(temp, target, open, direction);
            }
        }
        return false;
    },
    
    isMeet: function (point, direction) {
            return (point.state & direction) != direction && (point.state & notFound) != notFound;
    }
}


/*关于路径优化的部分*/
var optimize = function(path, line, reader) {
    var result = [], l = path.length;
    
    if (l < 2) {
        result = oneNodeStrategy(path[0], line, reader);
    }
    
    else if (l < 3) {
        result = twoNodeStrategy(path, line, reader);
    } 
    
    else {
        var s = line.getStartPoint(), e = line.getEndPoint(),
            
            sx = s.x - path[0].x, sy = s.y - path[0].y,
            
            i = 0, abs = Math.abs, min = Math.min, 
            
            startNode = reader.absoluteToRelative(s),
            endNode = reader.absoluteToRelative(e),
            
            startNormal = getDirection(line.model.sourceNode.get('bounds'), s), 
            endNormal = getDirection(line.model.targetNode.get('bounds'), e), 
            
            start, end = e;
        
        if (dotProduct(startNormal, getVector(path[1], path[0])) == 0) {
            start = similarity(s, startNormal, startNode, reader);
            sx = start.x - path[0].x;
            sy = start.y - path[0].y;
        }
        
        if (dotProduct(endNormal, getVector(path[l - 2], path[l - 1])) == 0) {
            end = similarity(e, endNormal, endNode, reader);
        }
        
        for (; i < l - 2; i++) {
                result.push({x: path[i].x + sx, y: path[i].y + sy});
        }
        
        var sf = min(1, abs(path[i - 1].x - path[i].x)), ef = min(1, abs(path[i + 1].x - path[i].x));
        
        result.push({x: ef*result[i - 1].x + sf*end.x,
                     y: sf*result[i - 1].y + ef*end.y});
        
        result.push(end);
            
        if (start != null && (start.x != s.x || start.y != s.y)) {
            result.unshift(s);
        }
            
        if (end != null && (end.x != e.x || end.y != e.y)) {
            result.push(e);
        }

    }
    
    return result;
};

var oneNodeStrategy = function(node, line, reader) {
    var s = line.getStartPoint(), e = line.getEndPoint();
    
    if ((s.x - e.x)*(s.y - e.y) == 0) {
        return [s, e];
    }
    
    var sourceb = line.model.sourceNode.get('bounds'), targetb = line.model.targetNode.get('bounds'), 
        sVector = getVector(s, {x : sourceb[0] + sourceb[2]/2, y : sourceb[1] + sourceb[3]/2}),
        eVector = getVector(e, {x : targetb[0] + targetb[2]/2, y : targetb[1] + targetb[3]/2}),
        vector  = getVector(e, s),
        p1, p2, table = {1 : {x:s.x, y:e.y}, 2: {x:e.x, y:s.y}}, bendpoint;
        
    
    p1 = sVector.x == 0 ? (sVector.y == vector.y ? 11 : 2) : (sVector.x == vector.x ? 12 : 1);
    p2 = eVector.x == 0 ? (sourceb.y == vector.y ? 1 : 12) : (eVector.x == vector.x ? 2 : 11);
    bendpoint = table[p1%10 == p2%10 ? p1%10 : Math.max(p1, p2)%10];
    
    return [s, bendpoint, e];    
}

var twoNodeStrategy = function(path, line, reader) {
    var s = line.getStartPoint(), e = line.getEndPoint();
    
    //共线的情况
    if ((s.x - e.x)*(s.y - e.y) == 0) {
        return [s, e];
    }
    
    //方向参考
    var startNormal = getDirection(line.model.sourceNode.get('bounds') ,s),
        endNormal = getDirection(line.model.targetNode.get('bounds'), e),
        abs_dir = getVector(e, s), rel_dir = {x: path[1].x - path[0].x, y: path[1].y - path[0].y},
        horizontal = rel_dir.x == 0 ?　0 : 1;
    
    //数学函数
    var max = Math.max, min = Math.min, abs = Math.abs;
    
    var result = [], coff, p1, p2;
    
    
    //垂直情况下
    if (dotProduct(startNormal, endNormal) == 0) {
        
        //确定与路径方向在一水平线上的点，并如果出现路径方向与Normal相反的情况，统一同向
        //与路径方向在一水平上的为参照点
        //coff大于0，说明参照点在另一点normal方向上正向偏移，反之为负向偏移
        //根据两点的相对位置选择拐点
        if (abs(dotProduct(startNormal, rel_dir)) == 1) {         
            startNormal.x = rel_dir.x;
            startNormal.y = rel_dir.y;
            
            coff = ((horizontal*(s.y - e.y) + (1 - horizontal)*(s.x - e.x)))*(endNormal.x + endNormal.y);
            //coff = max(0, coff/abs(coff));// 
            coff = coff == 1 ? 1 : 0;
        } else {
 
            endNormal.x = 0 - rel_dir.x;
            endNormal.y = 0 - rel_dir.y;
            
            coff = ((horizontal*(e.y - s.y) + (1 - horizontal)*(e.x - s.x)))*(startNormal.x + startNormal.y);
            
            //coff = abs(min(0, coff/abs(coff)));// 
            coff = coff == 1 ? 0 : 1;
        } 
        
        result = [s, {x: (1 - coff)*e.x + coff*s.x,
                      y: (1 - coff)*s.y + coff*e.y}, e];
        //result = [s, {x:(1 - horizontal)*s.x + horizontal*e.x, y: horizontal*s.y + (1 - horizontal)*e.y}, e];
    }
    
    //平行的情况下
    else {
        //同向情况
        if (dotProduct(startNormal, endNormal) == 1) {
            // ↑ ↑
            if (dotProduct(startNormal, rel_dir) == 0) {
                p1 = similarity(s, startNormal, path[0], reader);//
                p2 = similarity(e, endNormal, path[1], reader);
                abs_dir = getVector(p2, p1);
                
                if (dotProduct(startNormal, abs_dir) > 0 ) {
                    result = [s, {x: horizontal*s.x +　(1 - horizontal)*p2.x, y: (1 - horizontal)*s.y + horizontal*p2.y}, p2, e];
                } else {
                    result = [s, p1, {x: horizontal*e.x + (1 - horizontal)*p1.x, y: (1 - horizontal)*e.y + horizontal*p1.y}, e];
                }
            } 
            
            // ← ←
            else {
                //取方向上的拐点

                //coff大于0，说明方向上，起点在终点前面，反之
                coff = ((1 - horizontal)*(s.x - e.x) +　horizontal*(s.y - e.y))*(rel_dir.x + rel_dir.y);
                coff = coff > 0 ? 1 : 0;
                
                result = [s, {x: coff*s.x + (1 - coff)*e.x,
                              y: coff*e.y + (1 - coff)*s.y},e];
            }
        }
        
        //反向情况
        else {
            //选择间隙更大的中点
            if (abs(s.x - e.x) > abs(s.y - e.y)) {
                p1 = {x: (s.x + e.x)/2, y: s.y};
                p2 = {x: (s.x + e.x)/2, y: e.y};
            } else {
                p1 = {x: s.x, y: (s.y + e.y)/2};
                p2 = {x: e.x, y: (s.y + e.y)/2};
            }
            
            result = [s, p1, p2, e];
        }
        
    }
    
    return result;
};

/*计算向量*/
var getVector = function(p1, p2) {
    var max = Math.max, abs = Math.abs;
    return {x: (p1.x - p2.x)/max(1, abs(p1.x - p2.x)),
            y: (p1.y - p2.y)/max(1, abs(p1.y - p2.y))};
}

/*叉乘*/
var dotProduct = function(r1, r2) {
    return r1.x*r2.x + r1.y*r2.y;
}

var similarity = function(point, direction, node, reader) {
    var boundary, abs = Math.abs, max = Math.max, horizontal = abs(direction.x), gap;
    
    boundary = horizontal*(node.x + max(0, direction.x)) + (1 - horizontal)*(node.y + max(0, direction.y));
    boundary *= reader.w;
    
    gap = direction.x*(boundary - point.x) + direction.y*(boundary - point.y);

    if (gap >= 10) {
        return {x: point.x + 10*direction.x, y: point.y + 10*direction.y};
    } else {
        return point;
    }
};

const LEFT = {x: -1, y: 0};
const RIGHT = {x: 1, y: 0};
const UP = {x: 0, y: -1};
const DOWN = {x:0, y: 1};

var getDirection = function(bounds, point) {
    var i, x = bounds[0], y = bounds[1], right = bounds[0] + bounds[2], bottom = bounds[1] + bounds[3],
        direction = {x:LEFT.x, y:LEFT.y}, abs = Math.abs, distance = abs(x - point.x);
    
    i = abs(y - point.y);
    if (i <= distance) {
        distance = i;
        direction = {
            x: UP.x,
            y: UP.y
        };
    }
    
    i = abs(bottom - point.y);
    if (i <= distance) {
        distance = i;
        direction = {
            x: DOWN.x,
            y: DOWN.y
        };
    }
    
    i = abs(right - point.x);
    if (i < distance) {
        distance = i;
        direction = {
            x: RIGHT.x,
            y: RIGHT.y
        };
    }
    
    return direction;
};


/*监听器部分*/
var ReaderListener = anra.gef.EditPartListener.extend({
    partActivated: function (editPart) {
        editPart.getReader = (function () {
            var reader = null;
            return function () {
                if (!reader) {
                    reader = new Reader();
                }
                return reader;
            }
        })();
    },

    partDeactivated: function (editpart) {
        delete editpart.getReader;
    },

    childAdded: function (child, index) {
        if (child instanceof anra.gef.NodeEditPart) {
            var root = child.getRoot();
            root.getReader().read(child);
            this.on(child);
        }
    },

    removingChild: function (child, index) {
        if (child instanceof anra.gef.NodeEditPart) {
            child.getRoot().getReader().remove(child);
        }
    },

    on: function (editPart) {
        var model = editPart.model,
            bounds = model.get('bounds'),
            oldBounds = [
                bounds[0],
                bounds[1],
                bounds[2],
                bounds[3]
            ],
            reader = editPart.getRoot().getReader(),
            newBounds;
        model.addPropertyListener(function () {
            bounds = model.get('bounds');
            newBounds = [
                bounds[0],
                bounds[1],
                bounds[2],
                bounds[3]
            ];
            reader.change(newBounds, oldBounds);
            oldBounds = [
                bounds[0],
                bounds[1],
                bounds[2],
                bounds[3]
            ];
        }, 'bounds');
    }
});


/*预读器部分*/
function Reader() {
    this.struct = new Map();

    this._addList = [];
    this._deleteList = [];

    //暂时
    this.w = 25;
    this.maxWidth = 100;
    this.maxHeight = 100;

}
Reader.prototype.read = function (editPart) {
    if (!(editPart instanceof anra.gef.NodeEditPart)) {
        return;
    }

    var list = this._addList,
        b;

    if (editPart instanceof anra.gef.RootEditPart) {
        editPart.children.forEach(function (item, index, input) {
            b = item.model.get('bounds');
            list.push([
                b[0],
                b[1],
                b[2],
                b[3]
            ]);
        });
    } else {
        b = editPart.model.get('bounds');
        list.push([
            b[0],
            b[1],
            b[2],
            b[3]
        ]);
    }
};
Reader.prototype.remove = function (editPart) {
    if (editPart instanceof anra.gef.RootEditPart) {
        this.clear();
        return;
    }

    if (editPart instanceof anra.gef.NodeEditPart) {
        var b = editPart.model.get('bounds');
        this._deleteList.push([
            b[0],
            b[1],
            b[2],
            b[3]
        ]);
    }
};
Reader.prototype.change = function (newBounds, oldBounds) {
    this._addList.push(newBounds);
    this._deleteList.push(oldBounds);
};
Reader.prototype.structure = function () {    
    if((this._addList.length + this._deleteList.length) == 0) {
        return;
    }
    
    //先处理增加Bounds
    for (var i = 0; i < this._addList.length; i++) {
        this.process(this._addList[i], 1);
    }

    //处理删减的Bounds
    for (var j = 0; j < this._deleteList.length; j++) {
        this.process(this._deleteList[j], -1);
    }

    this._addList = [];
    this._deleteList = [];
};
Reader.prototype.process = function (bounds, unit) {
    var w = this.w,
        absolute_sx = bounds[0], absolute_sy = bounds[1],
        absolute_ex = bounds[0] + bounds[2], absolute_ey = bounds[1] + bounds[3],
        relative_sx = Math.floor(absolute_sx / w),
        relative_sy = Math.floor(absolute_sy / w),
        relative_ex = Math.ceil(absolute_ex / w),
        relative_ey = Math.ceil(absolute_ey / w), key;
    
    for (var i = relative_sx; i < relative_ex; i++) {
        for (var j = relative_sy; j < relative_ey; j++) {
            key = i + '_' + j;
            
            if (!this.struct.has(key)) {
                this.struct.put(key, {
                    count: 0
                });
            }
            
            this.struct.get(key).count += unit;
            
            //添加一个删除节点的操作
            if (this.struct.get(key).count == 0) {
                this.struct.remove(key);
            }
        }
    }
};

Reader.prototype.isValid = function(x, y) {
    if (x < -1 || x > this.maxWidth || y < -1 || y > this.maxHeight) {
        return false;
    }
    
    return true;
};

Reader.prototype.isObstacle = function(x, y) {
    if (!this.isValid(x, y)) {
        return true;
    }
    
    var key = x + '_' + y;
    if (!this.struct.has(key)) {
        return false;
    }
    
    if (this.struct.get(key).count == 0) {
        return false;
    } else {
        return true;
    }
};

//返回节点覆盖次数
Reader.prototype.getCount = function(x, y) {
    if (!this.isValid(x, y)) {
        return -1;
    }
    
    
    var key = x + '_' + y;
    if (!this.struct.has(key)) {
        return 0;
    } else {
        return this.struct.get(key).count;
    }
};

Reader.prototype.absoluteToRelative = function(point) {
    var x = Math.floor(point.x / this.w),
        y = Math.floor(point.y / this.w);
    
    return {x : x, y : y};
};

Reader.prototype.relativeToAbsolute = function(point) {
    var x = point.x*this.w,
        y = point.y*this.w;
    
    return {x : x, y : y};
}

Reader.prototype.getPath = function(path) {

    
    var result = [], w = this.w;
    
    for (var i = 0; i < path.length; i++) {
        result[i] = {x:path[i].x*w, y:path[i].y*w};
    }
    
    return result;
}

Reader.prototype.clear = function () {
    this.struct = new Map();

    this._addList = [];
    this._deleteList = [];
};

export {ReaderListener}

/**
 * 
 * 
 *
 */
export default function createRouter(config) {
    return function(line, reader) {
        return smoothRouter.route(line, reader);
    }
}