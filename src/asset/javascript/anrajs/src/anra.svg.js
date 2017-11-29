import {anra, Map, Util} from './anra.common'
import Base from '../lib/Base'
import * as layout from './anra.layout'

/**
 *SVG操作API
 * @type {Object}
 */
anra.svg = anra.svg || {};

anra.svg.Util = {
    createElement: function (widget, tagName) {
        var e = document.createElementNS("http://www.w3.org/2000/svg", tagName);
        if (widget) {
            widget.style = e.style;
        }
        return e;
    },
    apply: function (container, a, v) {
        if (a != null && typeof(a) == 'object')
            for (var k in a) {
                container[k] = a[k];
            }
        else if (typeof(a) == 'string') {
            container[a] = v;
        }
    },
    applyAttr: function (container, a, v) {
        if (a != null && typeof(a) == 'object')
            for (var k in a) {
                if (!(container.getAttribute(k) == a[k]))
                    container.setAttribute(k, a[k]);
            }
        else if (typeof(a) == 'string') {
            if (!(container.getAttribute(a) == v))
                container.setAttribute(a, v);
        }
    }
};

//todo
Object.assign(Util, anra.svg.Util);

/**
 *控件基类，生命周期。
 * 构建，
 * @type {*}
 */
anra.svg.Control = anra.Control.extend({
    svg: null,
    owner: null,
    layoutData: null,
    tagName: 'rect',
    bounds: null,
    parent: null,
    _attr: null,
    _style: null,
    ready: false,
    enable: true,
    bds: null,
    class: 'Control',
    defaultEvent: {'pointer-events': 'visible'},
    _init: function () {
        this.bds = {'x': 0, 'y': 0, 'width': 100, 'height': 100};
        this._style = {'pointer-events': 'none'};
        var t = this;
        Object.defineProperty(this, 'attr', {
            set: function (value) {
                t.setAttribute(value);
            }
        });
        Object.defineProperty(this, 'bounds', {
            get: function () {
                return t.bds;
            },
            set: function (value) {
                t.setBounds(value);
            }
        });
        if (this.init != null) this.init();
    },
    afterRemoveListener: function () {
        if (this.eventTable.size())
            this.disableEvent();

    },
    setOpacity: function (opa, all) {
        this.setStyle('opacity', opa);
        if (all && this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].setOpacity(opa, all);
            }
        }
    },
    afterAddListener: function () {
        if (this.eventTable.size() > 0)
            this.enableEvent();
    },
    disableEvent: function () {
        this.enable = true;
        this.setStyle('pointer-events', 'none');
    },
    enableEvent: function () {
        this.enable = false;
        this.setStyle(this.defaultEvent);
    },
    applyBounds: function () {
        if (this.bounds == null)
            return;
        var l = this.locArea();
        this.setAttribute('x', this.bounds.x + l[0]);
        this.setAttribute('y', this.bounds.y + l[1]);
        this.setAttribute('width', this.bounds.width);
        this.setAttribute('height', this.bounds.height);
    },
    setVisible: function (visible) {
        this.visible = visible;
        this.setStyle({
            visibility: visible ? 'visible' : 'hidden'
        });
    },
    createContent: function () {
    },
    /**
     * 绝对位置
     * @return {[x,y,width,height]}
     */
    getClientArea: function () {
        if (this.owner == null)
            return [0, 0, 0, 0];
        return [this.fattr('x'), this.fattr('y'), this.fattr('width'), this.fattr('height')];
    },
    getAttr: function (k, h) {
        if (this.owner == null)return this._attr ? this._attr[k] : null;
        if (h == null || typeof(h) != 'function')
            return this.owner.getAttribute(k);
        var a = this.owner.getAttribute(k);
        return a == null ? null : h(a);
    },
    fattr: function (k) {
        return this.getAttr(k, parseFloat);
    },
    getBounds: function () {
        return this.bounds;
    },
    removeAttribute: function (k) {
        this.owner.removeAttribute(k);
    },
    setAttribute: function (a, v) {
        if (this.owner == null) {
            if (this._attr == null)
                this._attr = {};
            Util.apply(this._attr, a, v);
            return;
        }
        if (this._attr != null) {
            Util.applyAttr(this.owner, this._attr);
            this._attr = null;
        }
        Util.applyAttr(this.owner, a, v);
        return this;
    },
    getStyle: function (key) {
        if (this.owner == null && this._style != null)
            return this._style[key];
        else if (this.owner != null) {
            return this.owner.style[key];
        }
    },
    setStyle: function (a, v) {
        if (this.owner == null) {
            if (this._style == null)
                this._style = {};
            Util.apply(this._style, a, v);
            return;
        }
        if (this._style != null) {
            Util.apply(this.owner.style, this._style);
            this._style = null;
        }
        Util.apply(this.owner.style, a, v);
        return this;
    },
    /**
     * 初始化属性，在构建完成后调用。
     */
    initProp: function () {
//        this.setAttribute({'fill':'white', 'stroke':'black'});
    },
    paint: function () {
        this.applyBounds();
        //this.repaint();
    },
    dispose: function () {
        anra.Widget.prototype.dispose.call(this);
    }
});
var Control = anra.svg.Control;
//初始化控件
Control.prototype.create = function () {
    if (this.owner == null) {
        var o = this;
        this.owner = Util.createElement(this, this.tagName);
        this.uuid = anra.genUUID();
        var e = this.owner;
        var dispatcher = anra.Platform.getDisplay().dispatcher;
        e.onmousedown = function (event) {
            //TODO
            dispatcher.setMouseTarget(o);
//            dispatcher.dispatchMouseDown(event);
        };

        e.oncontextmenu = function (event) {
            dispatcher.setMouseTarget(o);
        };
        e.ondragstart = function (event) {
            return false;
        };
//        e.onmousemove = function (event) {
//            dispatcher.setMouseTarget(o);
//            dispatcher.dispatchMouseMove(event);
//        };

        e.onmouseout = function (event) {
            event.figure = o;
            dispatcher.dispatchMouseOut(event);
            return false;
        };

        e.onmouseover = function (event) {
            event.figure = o;
            dispatcher.dispatchMouseIn(event);
        };

        e.onmouseup = function (event) {
            dispatcher.setMouseTarget(o);
            //因为交由父层分发了，所以不需要再触发
//            dispatcher.dispatchMouseUp(event);
        };

        e.ondblclick = function (event) {
            dispatcher.setMouseTarget(o);
            dispatcher.dispatchDoubleClick(event);
        };
        this.ready = true;

        //应用预设
        this.setAttribute({});
        this.setStyle({});
        this.initProp();
    }
    this.paint();
};
//设置父容器
Control.prototype.setParent = function (s) {
    if (s != null) {
        if (this.parent != null) {
            this.parent.removeChild(this.owner);
        }
        this.parent = s;
        this.svg = this.parent.svg;
        this.parent.domContainer().appendChild(this.owner);
        this.applyBounds();
        this.createContent(this);
        this.paint();
    }
};
Control.prototype.setBounds = function (b) {
    if (typeof(b) == 'object') {
        for (var k in b) {
            this.bds[k] = b[k];
        }
    }
    if (this.ready)
        this.applyBounds();
};
Control.prototype.locArea = function () {
    var xo = 0, yo = 0;
    if (this.parent != null) {
        var loc = this.parent.getClientArea();
        xo = loc[0] == null ? 0 : loc[0];
        yo = loc[1] == null ? 0 : loc[1];
    }
    return [xo, yo];
};


/**
 *容器类
 * @type {*}
 */

var _Composite = {
    children: null,
    layoutManager: null,
    selection: null,
    setSelection: function (o) {
        if (this.selection != null)
            this.selection.setSelected(false);
        this.selection = o;
        this.selection.setSelected(true);
    },
    removeChild: function (c) {
        if (c instanceof anra.svg.Control) {
            c.dispose();
            if (this.children != null)
                Util.removeObject.call(this.children, c);

            //this cause bugs, should fix
             if (this.domContainer().contains(c.owner))
            this.domContainer().removeChild(c.owner);
            c.parent = null;
        } else {
            anra.Platform.error('can not remove ' + (c == null ? null : c.toString() ) + ' from Composite');
        }
    },
    addChild: function (c, norefresh) {
        if (this.children == null) {
            this.children = [];
        }
        if (c instanceof anra.svg.Control) {
            if (!Util.contains.call(this.children, c)) {
                this.children.push(c);
                c.create();
                c.setParent(this);
                c.oncreated && c.oncreated();
                if (!norefresh)
                    this.paint();
            }
        } else {
            anra.Platform.error('can not add [' + c + '] to ' + this.tagName);
        }
    },
    /**
     * DOM容器
     * @return {*}
     */
    domContainer: function () {
        return this.parent == null ? this.svg.owner : this.parent.domContainer();
    },
    paint: function () {
        this.applyBounds();
        if (this.layoutManager != null)
            this.layout();

        if (this.children)
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].paint();
            }
    },
    layout: function () {
        this.layoutManager.layout(this);
    },
    removeAllChildren: function () {
        if (this.children != null) {
            var c = this.children.slice(0);
            for (var i = 0; i < c.length; i++) {
                this.removeChild(c[i]);
            }
        }
    },
    dispose: function () {
        this.removeAllChildren();
        this.children = null;
        this.layoutManager = null;
        Control.prototype.dispose.call(this);
    }
};
anra.svg.Composite = Control.extend(_Composite);
var Composite = anra.svg.Composite;

/**
 * 组
 * @type {*|void}
 */
anra.svg.Group = Composite.extend({
    animations: null,
    tagName: 'g',
    domContainer: function () {
        return this.owner;
    },
    _init: function () {
        if (this.init != null) this.init();
    },
    applyBounds: function () {
    },
    on: function () {
    },
    create: function () {
        //重写create方法，使Group不再接收任何事件
        if (this.owner == null) {
            var o = this;
            this.owner = Util.createElement(this, this.tagName);
            this.ready = true;
            //应用预设
            this.setAttribute({});
            this.setStyle({});
            this.initProp();
        }
//        this.paint();
    }
});

anra.svg.DefineArea = Composite.extend({
    tagName: 'defs',
    initProp: function () {
    },
    domContainer: function () {
        return this.owner;
    },
    setAttribute: function () {
    },
    setStyle: function () {
    }
});

anra.svg.Marker = Composite.extend({
    id: null,
    figure: null,
    tagName: 'marker',
    size: 3,
    constructor: function (config) {
        Composite.prototype.constructor.call(this);
        this.setId(anra.genUUID());
        // this.config = config;
        if (config)
            this.size = config.size;
    },
    setId: function (id) {
        this.id = id;
        this.setAttribute('id', id);
    },
    setFigureAttribute: function (attr) {
        this.figureAttr = attr;
        if (this.figure != null)
            this.figure.setAttribute(attr);
    },
    domContainer: function () {
        return this.owner;
    },
    setFigure: function (figure) {
        if (this.figure != null)
            this.removeChild(this.figure);
        this.figure = figure;
        this.addChild(this.figure);
        if (this.figureAttr != null)
            this.figure.setAttribute(this.figureAttr);

        // console.log(this.figure)
    },
    refresh: function (e) {
        // this.setStyle(this.figure);
        if (e) {
            // console.log(e.style.fill,e.style.stroke,e.getAttr('fill'));
            var stroke = e.style.stroke ? e.style.stroke : e.getAttr('stroke');
            this.setStyle({
                fill:stroke,
                stroke:stroke
            });
        }
    },
    propertyChanged: function (k, o, v) {
        if (this.propKey != null && this.propKey == k) {
            this.setFigureAttribute({'stroke': v});
            this.setFigureAttribute({'fill': v});
        }
    },
    initProp: function () {
        this.setAttribute({
            refX: "1",
            refY: "5",
            markerWidth: this.size ? this.size : 5,
            markerHeight: this.size ? this.size : 5,
            orient: "auto",
            viewBox: "-5 0 15 15"
        });
    }
});


anra.svg.PointMarker = anra.svg.Marker.extend({
    createContent: function () {
        var p = new anra.svg.Path();
        this.setFigure(p);
        p.setAttribute({
            d: 'M -4 0 C 5 5 L -4 10 z'
        });
    }
});

anra.svg.TriangleMarker = anra.svg.Marker.extend({
    createContent: function () {
        var p = new anra.svg.Path();
        this.setFigure(p);
        p.setAttribute({
            d: 'M -4 0 L 5 5 L -4 10 z'
        });
    }
});

anra.svg.Path = anra.svg.Control.extend({
    tagName: 'path',
    _init: function () {
        if (this.init != null) this.init();
    },
    afterRemoveListener: function () {
    },
    afterAddListener: function () {
    },
    initProp: function () {
    }
});

anra.svg.Line = {
    tagName: 'line',
    initProp: function () {
        this.setAttribute({
            stroke: 'black',
            'stroke-width': 1
        });
    },
    getClientArea: function () {
        return [this.fattr('x1') - this.fattr('x2'), this.fattr('y1') - this.fattr('y2')];
    },
    applyBounds: function () {
        var l = this.locArea();
        this.setAttribute('x1', this.bounds.x);
        this.setAttribute('x2', this.bounds.width);
        this.setAttribute('y1', this.bounds.y);
        this.setAttribute('y2', this.bounds.height);
    }
};

anra.svg.LineStrategy = {
    Straight: function (points, l) {
        var result = '';
        for (var i = 0; i < points.length; i++) {
            result += (i == 0 ? 'M' : 'L') + (points[i].x + l[0]) + ',' + (points[i].y + l[1]) + ' ';
        }
        return result;
    },
    Curve: function (points, l) {
        var result = '';
        for (var i = 0; i < points.length; i++) {
            result += (i == 0 ? 'M' : points.length - i - 1 < (points.length - 1) % 3 ? 'L' : i % 3 == 1 ? 'C' : '') + (points[i].x + l[0]) + ',' + (points[i].y + l[1]) + ' ';
        }
        return result;
    },
    x: function (points, l) {
        if (points.length > 2) {
            var p = [], j = 0, slope1, slope2, offx1, offx2;
            p.push(points[0]);
            while (j < points.length - 2) {
                offx1 = points[j].x - points[j + 1].x;
                offx2 = points[j].x - points[j + 2].x;
                
                if (Math.abs(offx1) + Math.abs(offx2) != 0) {
                    slope1 = (points[j].y - points[j + 1].y) / (offx1);
                    slope2 = (points[j].y - points[j + 2].y) / (offx2);
                    
                    if (slope1 != slope2) {
                        p.push(points[j + 1]);
                    }
                }
                j++;
            }
            p.push(Util.last.call(points));
            return this.Curve(p, l);
        }
    },
    CornerCurve: function (points, l) {
        var result = 'M' + (points[0].x + l[0]) + ',' + (points[0].y + l[1]) + 　' ',
            abs = Math.abs,
            min = Math.min,
            max = Math.max,
            x, y, preX, preY, nextX, nextY, gap;
        
        if (points.length == 2) {
            return result += 'L' + (points[1].x + l[0]) + ',' + (points[1].y + l[1]); 
        }
        
        nextX = points[1].x - points[0].x;
        nextY = points[1].y - points[0].y;

        for (var i = 1; i < points.length; i++) {
            x = points[i].x + l[0];
            y = points[i].y + l[1];

            if (i + 1 < points.length) {
                //与前驱点的XY差值
                preX = -nextX;
                preY = -nextY;
                
                //与后驱点的XY差值
                nextX = (points[i + 1].x + l[0]) - x;
                nextY = (points[i + 1].y + l[1]) - y;
                
                //
                gap = min(12.5, min(abs(preX + preY), abs(nextX + nextY)) / 2);
                result += 'L' + (x + (preX / max(abs(preX), 1)) * gap) + ',' + (y + (preY / max(abs(preY), 1)) * gap) + ' Q' + x + ',' + y + ' ' +
                    (x + (nextX / max(abs(nextX), 1)) * gap) + ',' + (y + (nextY / max(abs(nextY), 1)) * gap) + ' ';
            } else {
                result += 'L' + x + ',' + y;
            }
        }
        return result;
    },
    //支持所有方向
    CornerCurveProfessional : function(points, l) {
        var result = 'M' + (points[0].x + l[0]) + ',' + (points[0].y + l[1]) + 　' ',
            abs = Math.abs,
            min = Math.min,
            max = Math.max,
            x, y, preX, preY, nextX , nextY, gap;
        
        if (points.length == 2) {
            return result += 'L' + (points[1].x + l[0]) + ',' + (points[1].y + l[1]); 
        }
        
        nextX = points[1].x - points[0].x;
        nextY = points[1].y - points[0].y;

        for (var i = 1; i < points.length; i++) {
            x = points[i].x + l[0];
            y = points[i].y + l[1];

            if (i + 1 < points.length) {
                
                //与前驱点的XY差值
                preX = -nextX;
                preY = -nextY;
                
                //与后驱点的XY差值
                nextX = (points[i + 1].x + l[0]) - x;
                nextY = (points[i + 1].y + l[1]) - y;
                
                //
                
                var p = preX*preX + preY*preY,
                    n = nextX*nextX + nextY*nextY, 
                    minX, minY, anX, anY;
                gap = min(25*25, p, n);
                
                if (gap == 25) {
                    //暴力算出来
                } else if (gap == p) {
                    minX = x + preX;
                    minY = y + preY;
                    anX = x + nextX;
                    anY = y + nextY;
                } else {
                    minX = x + nextX;
                    minY = y + nextX;
                    anX = x + preX;
                    anY = y + preY;
                }
                
                
                gap = min(12.5, min(abs(preX + preY), abs(nextX + nextY)) / 2);
                
                result += 'L' + (x + (preX / max(abs(preX), 1)) * gap) + ',' + (y + (preY / max(abs(preY), 1)) * gap) + ' Q' + x + ',' + y + ' ' +
                    (x + (nextX / max(abs(nextX), 1)) * gap) + ',' + (y + (nextY / max(abs(nextY), 1)) * gap) + ' ';
            } else {
                result += 'L' + x + ',' + y;
            }
        }
        return result;
    }
};


anra.svg.Polyline = {
    points: null,
    close: false,
    tagName: 'path',
    defaultEvent: {'pointer-events': 'stroke'},
    strategy: anra.svg.LineStrategy.CornerCurve,
    applyBounds: function () {
        var d = this.compute();
        if (d != null)
            this.setAttribute('d', d);
    },
    initProp: function () {
        this.setAttribute({
            fill: 'none'
        });
    },
    compute: function () {
        if (this.points == null || this.points.length < 2)
            return null;
        return this.strategy(this.points, this.locArea());
    },
    getStartPoint: function () {
        return this.points == null || this.points.length == 0 ? null : this.points[0];
    },
    getEndPoint: function () {
        return this.points == null || this.points.length == 0 ? null : this.points[this.points.length - 1];
    }
};


/**
 * 动画
 * @type {*|void}
 */
anra.svg.Animation = Control.extend({
    tagName: 'animateTransform'
});

anra.SVG = Composite.extend(anra._Display).extend(anra._EventTable).extend({
    dispatcher: null,
    defs: null,
    constructor: function (id) {
        this.element = document.getElementById(id);
        if (this.element != null) {
            this.create();
            this.element.appendChild(this.svg.owner);
        } else {
            this.error("SVG parent can not be null");
        }
    },
    create: function () {
        this.owner = Util.createElement(this, 'svg');
        this.owner.setAttribute('version', '1.1');
        this.owner.style.position = 'absolute';
        this.owner.style.top = 0;
        this.owner.style.left = 0;
        this.owner.style.width = '150%';
        this.owner.style.height = '150%';
        this.svg = this;
        this.dispatcher = new anra.svg.EventDispatcher(this);
        var d = this.dispatcher;
        var t = this;
        d.setMouseTarget(t);
//TODO
        this.element.oncontextmenu = function (event) {
            try {
                anra.Platform.focus = t;
                d.setMouseTarget(t);
                d.dispatchContextMenu(event);
            } catch (e) {
                console.error(e)
            }
            return false;
        };
        this.element.onmousedown = function (event) {
            anra.Platform.focus = t;
            if (t.owner == event.target)
                d.setMouseTarget(t);
            d.dispatchMouseDown(event);
            return false;
        };
        this.element.ondragstart = function (event) {
            return false;
        },
            this.element.onclick = function (event) {
                d.dispatchMouseClick(event);
                return false;
            };
        this.element.onmousemove = function (event) {
            d.dispatchMouseMove(event);
            return false;
        };


//        this.element.ondrag=function(event){
//            console.log('drag')
//            return true;
//        };
        this.element.onmouseover = function (event) {
            if (t.owner == event.target || t.owner.parentNode == event.target) {
                event.figure = t;
                d.dispatchMouseIn(event);
            }
            return false;
        };
        this.element.onmouseout = function (event) {
            var x = event.clientX;
            var y = event.clientY;
/*            if (x < div.offsetLeft || x > div.offsetLeft + div.offsetWidth || y < div.offsetTop || y > div.offsetTop + div.offsetHeight) {
                event.target = t;
                d.dispatchMouseOutScreen(event);
            }*/
            return false;
        };
        this.element.onmouseup = function (event) {
            anra.Platform.focus = t;
            if (t.owner == event.target)
                d.setMouseTarget(t);
            d.dispatchMouseUp(event);
            return false;
        };
        anra.Platform.regist();
        anra.Platform.focus = this;

        this.defs = new anra.svg.DefineArea();
        this.addChild(this.defs);
    }

});

anra.svg.Rect = {};
anra.svg.Circle = {
    tagName: 'circle',
    getClientArea: function () {
        return [this.fattr('cx'), this.fattr('cy'), this.fattr['r'] * 2, this.fattr['r'] * 2];
    },
    applyBounds: function () {
        var l = this.locArea();
        var r = this.bounds.width / 2;
        this.setAttribute({
            r: r,
            cx: this.bounds.x + l[0],
            'cy': this.bounds.y + l[1]
        });
    },
    calAnchor: function (dir, offset) {
        if (offset == null) offset = 0;
        var b = this.bounds;
        switch (dir) {
            case anra.EAST:
                return {x: b['x'] + b['width'] / 2, y: b['y']};
            case anra.SOUTH:
                return {x: b['x'], y: b['y'] + b['width'] / 2};
            case anra.WEST:
                return {x: b['x'] - b['width'] / 2, y: b['y']};
            case anra.NORTH:
                return {x: b['x'], y: b['y'] - b['width'] / 2};
            case anra.CENTER:
                return {x: b['x'], y: b['y']};
        }
        return null;
    }
};
anra.svg.Image = {
    tagName: 'image',
    url: null,
    applyConfig: function (config) {
        this.setUrl(config.url);
    },
    setUrl: function (url) {
        this.url = url;
        if (this.owner != null) {
            this.owner.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'xlink:href',
                url);
        }
    },
    initProp: function () {
        this.owner.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href',
            this.url);
        this.owner.setAttribute('preserveAspectRatio','none');
    }
};
/**
 * 文本
 * @type {*|void}
 */
anra.svg.Text = {
    tagName: 'text',
    text: null,
    setText: function (text) {
        this.text = text;
        if (this.owner != null) {
            this.owner.textContent = text;
        }
    },
    initProp: function () {
        this.owner.textContent = this.text;
    },
    create: function () {
        //此处没有注册事件分发，因为文本的事件会和anra的事件冲突
        if (this.owner == null) {
            var o = this;
            this.owner = Util.createElement(this, this.tagName);

            var e = this.owner;
            var dispatcher = anra.Platform.getDisplay().dispatcher;
            e.onmouseup = function (event) {
                dispatcher.setMouseTarget(o);
//                dispatcher.dispatchMouseUp(event);
            };
            this.setAttribute({});
            this.setStyle({
                'font-size': 15,
                '-webkit-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            });
            this.initProp();
        }
    }
};


anra.svg.Ellipse = {
    tagName: 'ellipse',
    getClientArea: function () {
        return [this.fattr('cx') - this.fattr('rx'), this.fattr('cy') - this.fattr('ry')];
    },
    applyBounds: function () {
        var l = this.locArea();
        this.setAttribute('rx', this.bounds.width / 2);
        this.setAttribute('ry', this.bounds.height / 2);
        this.setAttribute('cx', this.bounds.x + this.fattr('rx') + l[0]);
        this.setAttribute('cy', this.bounds.y + this.fattr('ry') + l[1]);
    }
};

/**
 * 布局
 * @type {*}
 */
anra.svg.Layout = layout.Layout;
anra.svg.FillLayout = layout.FillLayout;
anra.svg.GridLayout = layout.GridLayout;
anra.svg.GridData = layout.GridData;

/*anra.svg.Layout = Base.extend({
    layout: function (comp) {
    }
});

anra.svg.GridLayout = anra.svg.Layout.extend({});

anra.svg.GridData = Base.extend({});*/
var count = 0;
/**
 * 事件分发器
 * @type {*}
 */
anra.svg.EventDispatcher = Base.extend({
    display: null,
    constructor: function (display) {
        this.display = display;
    },
    focusTarget: null,
    mouseState: 0,
    dispatchMouseDown: function (event) {
        this.mouseState = anra.EVENT.MouseDown;
        var location = this.getRelativeLocation(event),
            e = new anra.event.Event(anra.EVENT.MouseDown, location);
/*        e.x = e.canvasX = location[0];
        e.y = e.canvasY = location[1];
        if (this.display != this.focusTarget) {
            e.x -= this.focusTarget.getAttr('x', parseFloat);
            e.y -= this.focusTarget.getAttr('y', parseFloat);
        }*/
        
        e.button = event.button;
        e.prop = {drag: this.dragTarget, target: this.focusTarget};
        var widget = this.focusTarget;
        widget.notifyListeners(anra.EVENT.MouseDown, e);
//        if (widget != widget.svg)
//            widget.svg.notifyListeners(anra.EVENT.MouseDown, e);
//        widget.setFocus();
    },
    dispatchMouseClick: function (event) {
        this.mouseState = anra.EVENT.MouseUp;
        var location = this.getRelativeLocation(event),
            e = new anra.event.Event(anra.EVENT.MouseDown, location);
        
        /*e.x = e.canvasX = location[0];
        e.y = e.canvasY = location[1];
        if (this.display != this.focusTarget) {
            e.x -= this.focusTarget.getAttr('x', parseFloat);
            e.y -= this.focusTarget.getAttr('y', parseFloat);
        }
        */
        e.prop = {drag: this.dragTarget, target: this.focusTarget};
        var widget = this.focusTarget;
        widget.notifyListeners(anra.EVENT.MouseClick, e);
    },
    dispatchMouseMove: function (event) {
        //提高效率
        if ((++count ) % 2 != 0) {
            if (count > 101)
                count = 0;
            return;
        }

        //这玩意儿错误超多，后面考虑个完善方式，主要是拖拽物和鼠标所在容器的矛盾
        if (this.mouseOnTarget == null) this.mouseOnTarget = this.focusTarget;
        //模拟拖拽
        var e;
        var location = this.getRelativeLocation(event);
        if ((this.mouseState == anra.EVENT.MouseDown) || (this.mouseState == anra.EVENT.MouseDrag)) {
            this.mouseState = anra.EVENT.MouseDrag;
            if (this.dragTarget == null) {
                this.dragTarget = this.focusTarget;
                e = new anra.event.Event(anra.EVENT.DragStart, location);

                e.prop = {drag: this.dragTarget, target: this.mouseOnTarget};
                this.dragTarget.notifyListeners(anra.EVENT.DragStart, e);
                if (this.dragTarget != this.mouseOnTarget && this.mouseOnTarget.notifyListeners){
                    this.mouseOnTarget.notifyListeners(anra.EVENT.DragStart, e);    
                }
            }
            if (this.dragTarget.enable)
                this.dragTarget.disableEvent();
        } else {
            this.mouseState = anra.EVENT.MouseMove;
            e = new anra.event.Event(anra.EVENT.MouseMove, location);
            
            this.mouseOnTarget.notifyListeners(anra.EVENT.MouseMove, e);
        }
        if (this.dragTarget != null && (this.mouseState == anra.EVENT.MouseDrag)) {
            e = new anra.event.Event(anra.EVENT.MouseDrag, location);
            
            e.prop = {drag: this.dragTarget, target: this.mouseOnTarget};
            this.dragTarget.notifyListeners && this.dragTarget.notifyListeners(anra.EVENT.MouseDrag, e);
            if (this.dragTarget != this.mouseOnTarget && this.mouseOnTarget.notifyListeners)
                this.mouseOnTarget.notifyListeners(anra.EVENT.MouseDrag, e);
        }
    },
    dispatchMouseUp: function (event, global) {
        var widget = this.mouseOnTarget;
        var location = this.getRelativeLocation(event);
        var notified = false;
        if (this.mouseState == anra.EVENT.MouseDrag) {
            var e = new anra.event.Event(anra.EVENT.DragEnd, location);
            e.prop = {drag: this.dragTarget, target: widget};
            e.button = event.button;

            if (this.dragTarget instanceof anra.svg.Control) {
                this.dragTarget.notifyListeners(anra.EVENT.Dropped, e);
                this.dragTarget.enableEvent();
                notified = true;
            }
            widget.notifyListeners(anra.EVENT.DragEnd, e);
        }
        this.mouseState = anra.EVENT.MouseUp;
        if (!notified) {
            e = new anra.event.Event(anra.EVENT.MouseUp, location);
            e.button = event.button;
            if (this.mouseOnTarget != null)
                this.mouseOnTarget.notifyListeners(anra.EVENT.MouseUp, e);
            else
                this.focusTarget.notifyListeners(anra.EVENT.MouseUp, e);
        }
        this.dragTarget = null;
    },
    dispatchMouseIn: function (event) {
        var location = this.getRelativeLocation(event);
        var e = new anra.event.Event(anra.EVENT.MouseIn, location);

        e.button = event.button;
        if (this.dragTarget != event.figure){
            this.mouseOnTarget = event.figure;
        }
        event.figure.notifyListeners(anra.EVENT.MouseIn, e);
    },
    dispatchMouseOut: function (event) {
        var loc = this.getRelativeLocation(event),
            relatedTarget = event.toElement,
            //relatedTarget = event.relatedTarget,
            contains = anra.Rectangle.contains,
            eb = event.figure.bounds,
            b;

        try {
            if (relatedTarget) {
                switch (relatedTarget.nodeName) {
                    case 'svg':
                        break;
                    case 'DIV':
                        break;
                    case 'image':
                    case 'rect':
                        b = {
                            x: parseFloat(relatedTarget.getAttribute('x')),
                            y: parseFloat(relatedTarget.getAttribute('y')),
                            width: parseFloat(relatedTarget.getAttribute('width')),
                            height: parseFloat(relatedTarget.getAttribute('height'))
                        }
                        
                        if (contains(eb, b.x, b.y) && (b.x + b.width) < (eb.x + eb.width) && (b.y + b.height) < (eb.y + eb.height) &&
                            contains(eb, loc[0], loc[1])) {
                            return;
                        }
                        break;
                    case 'ellipse':
                        b.rx = parseFloat(relatedTarget.getAttribute('rx'));
                        b.ry = parseFloat(relatedTarget.getAttribute('ry'))
                    case 'circle':
                        if (b == null) {
                            b = {rx: null, ry: null, cx: null, cy: null};
                            b.rx = b.ry = relatedTarget['r'].value;
                        }
                        
                        b.cx = parseFloat(relatedTarget.getAttribute('cx'))
                        b.cy = parseFloat(relatedTarget.getAttribute('cy'))

                        if (!contains(eb, b.cx, b.cy) || (b.cx - b.rx) < eb.x || (b.cx + b.rx) > (eb.x + eb.width) ||
                            (b.cy - b.ry) < eb.y || (b.cy + b.ry) > (eb.y + eb.height)) {
                            break;
                        }
                    case 'marker':
                    case 'line':
                    case 'path':
                        if (contains(eb, loc[0], loc[1])) {
                            return;
                        }
                        
                        break;
                    case 'text':
                    default:
                }
            }
        } catch (e) {
            console.warn(relatedTarget)
        }

        var e = new anra.event.Event(anra.EVENT.MouseOut, loc);
        event.figure.notifyListeners(anra.EVENT.MouseOut, e);
    },
    dispatchMouseOutScreen: function (event) {
//        this.mouseState = anra.EVENT.MouseOut;
//        this.dragTarget = null;
    },
    dispatchDoubleClick: function (event) {
        var location = this.getRelativeLocation(event);
        var e = new anra.event.Event(anra.EVENT.MouseDoubleClick, location);
        this.focusTarget.notifyListeners(anra.EVENT.MouseDoubleClick, e);
    },
    dispatchKeyDown: function (event) {
        var e = new anra.event.KeyEvent(anra.EVENT.KeyDown, this.getRelativeLocation(event), event);
        //TODO 此处需要优化，考虑到底是目标还是画布来触发事件
//        var f = this.focusTarget == null ? this.display : this.focusTarget;
        var f = this.display;
        f.notifyListeners(e.type, e);
    },
    dispatchKeyUp: function (event) {
        var e = new anra.event.KeyEvent(anra.EVENT.KeyUp, this.getRelativeLocation(event), event);
//        var f = this.focusTarget == null ? this.display : this.focusTarget;
        var f = this.display;
        f.notifyListeners(e.type, event);
    },
    dispatchTouchStart: function (event) {
        var location = this.getRelativeLocation(event.touches[0]);
        var e = new anra.event.TouchEvent(anra.EVENT.TouchStart, location, event);
        this.focusTarget.notifyListeners(anra.EVENT.TouchStart, e);
    },
    dispatchTouchMove: function (event) {
        var location = this.getRelativeLocation(event.touches[0]);
        if (location[0] == null)
            return;
        var e = new anra.event.TouchEvent(anra.EVENT.TouchMove, location, event);
        this.focusTarget.notifyListeners(anra.EVENT.TouchMove, e);
    },
    dispatchTouchEnd: function (event) {
        var location = this.getRelativeLocation(event.touches[0]);
        if (location[0] == null)
            return;
        var e = new anra.event.TouchEvent(anra.EVENT.TouchEnd, location, event);
        this.focusTarget.notifyListeners(anra.EVENT.TouchEnd, e);
    },
    dispatchContextMenu: function (event) {
        var e = new anra.event.Event();
        var location = this.getRelativeLocation(event);
        e.x = location[0];
        e.y = location[1];
        e.target = this.mouseOnTarget;
        this.focusTarget.notifyListeners(anra.EVENT.ContextMenu, e);
    },
    setMouseTarget: function (o) {
        if (this.focusTarget != null) {
            this.focusTarget.enableEvent();
        }
        this.focusTarget = o;
    },
    getRelativeLocation: function (event) {
        return this.display.getRelativeLocation(event);
    }
});

anra.svg.MenuItem = Composite.extend({
    constructor: function (action) {
        Composite.prototype.constructor.call(this)
        this.action = action;
    },
    createContent: function () {
        if (this.action.image != null) {
            var image = anra.svg.Control.extend(anra.svg.Image);
            image = new image();
            image.setUrl(this.action.image);
            this.addChild(image);
            image.setBounds({x: 5, y: 5, width: 20, height: 20});
        }

        var text = anra.svg.Control.extend(anra.svg.Text);
        text = new text();
        text.setText(this.action.name);
        this.addChild(text);
        text.setBounds({x: 30, y: 20});

        var item = this;
        this.on(anra.EVENT.MouseIn, function () {
            item.setAttribute({
                fill: 'green'
            });
        });
        this.on(anra.EVENT.MouseOut, function () {
            item.setAttribute({
                fill: 'none'
            });
        });
        this.on(anra.EVENT.MouseDown, function (e) {
            if (e.button != 0)return;
            item.action.run();
            item.menu.hide();
        });
    },
    initProp: function () {
        this.setAttribute({
            fill: 'none',
            stroke: 'none'
        });
    }
});

anra.svg.DefMenu = Composite.extend({
    constructor: function (host) {
        Composite.prototype.constructor.call(this);
        this.host = host;
    },
    domContainer: function (action) {
        return this.owner.parentNode;
    },
    createContent: function () {
        this.layoutManager = new anra.svg.FillLayout();
    },
    initProp: function () {
        this.setAttribute({
            fill: 'white',
            stroke: 'black'
        });
    },
    addMenuItem: function (action) {
        var item = new anra.svg.MenuItem(action);
        item.menu = this;
        this.addChild(item);
    },
    clearMenuItems: function () {
        this.removeAllChildren();
    },
    hide: function () {
        this.clearMenuItems();
        this.setStyle('visibility', 'hidden');
    },
    setOpacity: function (opa) {
        this.parent.setOpacity(opa);
    },
    show: function (editor, e) {
        var selection = editor.rootEditPart.selection;
        var cmdStack = editor.cmdStack;
        if (this.selection == selection) {
            return;
        }
        this.clearMenuItems();
        this.setBounds({x: e.x, y: e.y});
        this.setStyle('visibility', 'visible');

        var count = this.addActions(this.host.actionRegistry.selectionActions, selection);
        count += this.addActions(this.host.actionRegistry.cmdStackActions, cmdStack);
        count += this.addActions(this.host.actionRegistry.propertyActions, editor);

        if (count == null)
            return;

        this.setBounds({width: 100, height: 30 * count});
        this.paint();
        this.play(0, 0.05);
    },
    play: function (s, intval) {
        this.setOpacity(s, true);
        if (s >= 1)return;
        var p = this;
        requestAnimationFrame(function () {
            p.play(s + intval, intval);
        });
    },
    addActions: function (actions, _t) {
        var count = 0;
        if (actions != null) {
            actions = actions.values();
            for (var i = 0; i < actions.length; i++) {
                actions[i].stack = _t;
                actions[i].selection = _t;
                actions[i].editor = _t;
                if (actions[i].name != null && (actions[i].check == null || actions[i].check())) {
                    actions[i].enable = true;
                    count++;
                    this.addMenuItem(actions[i]);
                } else
                    actions[i].enable = false;
            }
        }
        return count;
    }
});

export {anra};