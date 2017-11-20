import {$AG, constants, smoothRouter} from 'anrajs'
import * as globalConstants from 'Constants'
import {Terminals, Terminal, Name, Desp} from '../propsName';
import * as props from '../propsName';
import Cncryption from '../../../../utils/encryption';

export const refresh = function () {
    if (this.model && this.figure) {
        var b = this.model.get('bounds');
        this.figure.bounds = {
            x: b[0],
            y: b[1],
            width: b[2],
            height: b[3]
        };
        this.figure.style.fill = this.model.get('color');
    }
    this.figure.paint();
};

export const manhattanRoute = {
    style: {
        'stroke': 'green',
        'stroke-width': 3,
    },
    type: $AG.CURVE_LINE,
    router: smoothRouter(),
    endMarker: {
        type: $AG.Marker.TRIANGLE,
        size: 3
    },
    selectable: true,
    policies: {
        'hover': {
            activate() {
                this.mouseInListener = () => {
                    this.line = new $AG.LINE();
                    this.line.setAttribute('d', this.getHost().getFigure().getAttr('d'));
                    this.line.setStyle({
                        'stroke': this.getHost().getSelected() == constants.SELECTED_NONE ? 'green' : 'red',
                        'stroke-width': 10,
                        'stroke-linecap': 'butt',
                        'stroke-opacity': 0.2,
                    });
                    this.getLineLayer().addChild(this.line);
                    this.getLineLayer().domContainer().removeChild(this.line.owner);
                    this.getLineLayer().domContainer().insertBefore(this.line.owner, this.getHost().getFigure().owner);
                };
                this.mouseOutListener = () => {
                    this.getLineLayer().removeChild(this.line);
                };
                this.addSelectionListener();
                this.getHost().getFigure().on('mousein', this.mouseInListener);
                this.getHost().getFigure().on('mouseout', this.mouseOutListener);
            },
            deactivate() {
                this.line = null;
                this.getHost().getFigure().off('mousein', this.mouseInListener);
                this.getHost().getFigure().off('mouseout', this.mouseOutListener);
                this.getHost().removeEditPartListener(this.selectionListener);
            },
            addSelectionListener() {
                var policy = this;
                var SelectionEditPartListener = $AG.EditPartListener.extend({
                    selectedStateChanged: function (editPart) {
                        if (policy.line) {
                            switch (editPart.getSelected()) {
                                case constants.SELECTED_NONE:
                                    policy.line.setStyle('stroke', 'green');
                                    break;
                                case constants.SELECTED:
                                case constants.SELECTED_PRIMARY:
                                    policy.line.setStyle('stroke', 'red');
                                    break;
                                default :
                            }
                        }
                    }
                });
                this.selectionListener = new SelectionEditPartListener();
                this.getHost().addEditPartListener(this.selectionListener);
            }
        }
    }
};

//策略
export const openPropEditor = {
    activate(){
        this.lisn = () => {
            this.emit(globalConstants.OPEN_FLOWPROP_DIALOG, this.getHost())
        };
        this.getHostFigure().on('dblclick', this.lisn);
    },
    deactivate(){
        this.getHostFigure().off('dblclick', this.lisn);
    }
};

export const openNodeEditor = {
    activate() {
        let self = this;

        this.listener = function () {
            var host = self.getHost(), unSelected = host.getSelected() == constants.SELECTED_NONE;

            /*单击且选中*/
            if (unSelected) return;

            self.emit(globalConstants.OPEN_NODE_EDITOR, host.model);
        }

        this.getHostFigure().on('mousedown', this.listener);
    },

    deactivate() {
        this.getHostFigure().off('mousedown', this.listener);
    }
}

export const closeNodeEditor = {
    activate() {

        this.listener = () => {
            var host = this.getHost(), unSelected = host.getSelected() == constants.SELECTED_NONE;

            /*单击且选中*/
            if (unSelected) return;

            this.emit(globalConstants.CLOSE_NODE_EDITOR);
        }

        this.getHostFigure().on('mousedown', this.listener);
    },

    deactivate() {
        this.getHostFigure().off('mousedown', this.listener);
    }
}

export const pinHandle = $AG.Handle.extend($AG.CIRCLE).extend({
    constructor(editPart, anchorId) {
        $AG.Handle.prototype.constructor.call(this, editPart);
        this.anchorId = anchorId;
    },
    initProp() {
        let anchor = this.editPart.getSourceAnchorByTerminal(this.anchorId);

        if (anchor) {
            this.setOpacity(1);

            this.setAttribute({
                "stroke": "black",
                "stroke-width": 2,
                "fill": this.colorMap[this.anchorId]
            });
            this.setStyle({'cursor': 'move'});

            this.setBounds({
                x: anchor.x,
                y: anchor.y,
                width: 10
            }, true);
        }
    },
    colorMap: {
        "-1": "black",
        "0": "red",
        "1": "green",
        "2": "yellow"
    },
    refreshLocation: function (figure) {
        var anchor = figure.getSourceAnchorByTerminal(this.anchorId);
        this.setBounds({
            x: anchor.x,
            y: anchor.y,
            width: 10
        });
    }
});

export const terminalPolicy = function ({isListen = false} = {}) {
    return {
        getTerminals() {
            let terminls = this.getHost().model.get(Terminals);

            //可能xml转json，数组和对象的差异
            return terminls && terminls[Terminal] ? [].concat(terminls[Terminal]) : [];
        },
        createPinHandle(anchorId) {
            if (anchorId == null) return null;

            if (this.getHost().getSourceAnchorByTerminal(anchorId) == null) return null;

            return new pinHandle(this.getHost(), anchorId);
        },
        activate() {
            if (isListen) {
                //注：与model数据同步
                this.handles = new Map();
                this.getTerminals().forEach(item => {
                   let pin = this.createPinHandle(item[Name]);

                    if (pin) {
                        this.handles.set(item[Name], pin);
                        this.getHandleLayer().addChild(pin);
                    }
                });

                this.listener = () => {
                    let terminals = new Map(this.getTerminals().map((item) => [item[Name], item[Desp]]));

                    //新增的
                    [...terminals.keys()].filter(name => !this.handles.has(name)).forEach(item => {
                        let  pin = this.createPinHandle(item);
                        if (pin) {
                            this.handles.set(item, pin);
                            this.getHandleLayer().addChild(pin);
                        }
                    });

                    //移除的
                    [...this.handles].filter(([name, handle]) => !terminals.has(name)).forEach(([name, handle]) => {
                        this.getHandleLayer().removeChild(handle);
                        this.handles.delete(name);
                    })
                }

                this.getHost().model.addPropertyListener(this.listener, Terminals);
            } else {
                let terminals = this.getTerminals();

                this.handles = Array.of();
                terminals.forEach(item => {
                    let pin = this.createPinHandle(item[Name]);

                    if (pin){
                        this.getHandleLayer().addChild(pin);
                        this.handles.push(pin);
                    }
                });
            }
        },
        deactivate() {
            if (isListen) {
                this.getHost().model.removePropertyListener(this.listener, Terminals);
            }

            [...this.handles.entries()].forEach(([index, handle]) => this.getHandleLayer().removeChild(handle));
            this.handles = null;
        }
    };
}

const commonDataHandle = [
    [props.UUID, (model) => model.hashCode()]
];
export const SecurityDataHandle = [
    props.Security,
    (model) => ({...model.get(props.Security), [props.Readonly]: Cncryption.encrypt('0', model.get(props.UUID))})
];

export const initDataPolicy = function (handles = commonDataHandle) {
    let dataHandles = new Map(handles);
    let policy = {
        activate() {
            if (this.getHost().model.get('UUID')) return;

            dataHandles.forEach(function(value, key) {
                this.model.set(key, value(this.model, this, this.getRoot()));
            }, this.getHost());
        },
        deactivate() {
            //dataHandles.clear();
        },
        set(...res) {
            if (res.length == 2 && typeof res[0] == 'string' && res[1] instanceof Function) {
                dataHandles.set(res[0], res[1]);
            } else {
                res.forEach(item => {
                    if (item instanceof Array && typeof item[0] == 'string' && item[1] instanceof Function)
                        dataHandles.set(item[0], item[1]);
                });
            }
            return policy;
        }
    }

    return policy;
}

/***************************************右键菜单***************************************/
export const operations = [

    /*全选*/
    {
        id: 'selectAll',
        name: '全选',
        type: constants.ACTION_SELECTION,
        key: 'ctrl+a',
        run: function () {
            this.host.rootEditPart.setSelection(this.host.rootEditPart.children);
        }
    },

    {
        id: 'delete',
        name: '删除',
        type: constants.ACTION_SELECTION,
        key: 'delete',
        check: function () {
            return this.selection instanceof $AG.NodeEditPart ||
                this.selection instanceof $AG.LineEditPart ||
                (this.selection instanceof Array && this.selection.length > 0);
        },
        run: function () {
            var cmd, selection = this.selection,
                root = selection instanceof Array ? selection[0].getRoot() : selection.getRoot();

            if (selection instanceof $AG.NodeEditPart || selection instanceof Array) {
                cmd = new $AG.DeleteNodeAndLineCommand(root, selection);
            } else {
                cmd = new $AG.DeleteLineCommand(root, selection);
            }

            if (cmd != null) {
                root.editor.execute(cmd);
            }
            root.setSelection(null);
        }
    },

    {
        id: 'undo',
        name: '撤销',
        type: constants.ACTION_STACK,
        key: 'ctrl+z',
        check: function () {
            return this.host.cmdStack.canUndo();
        },
        run: function () {
            this.host.cmdStack.undo();
        }
    },

    {
        id: 'redo',
        name: '重做',
        type: constants.ACTION_STACK,
        key: 'ctrl+y',
        check: function () {
            return this.host.cmdStack.canRedo();
        },
        run: function () {
            this.host.redo();
        }
    },

    {
        id: 'save',
        name: '保存',
        type: constants.ACTION_STACK,
        check: function () {
            return this.host.isDirty();
        },
        run: function () {
            this.host.doSave();
        }
    }

];


/***************************************  节点  ***************************************/

/*暂时使用的desp位置*/
export const location = function (figure) {
    var text = this.text,
        length;

    if (text == null) {
        length = 0
    } else {
        if (typeof text != "string") text += "";

        length = text.replace(/[^\x00-\xff]/g, "01").length;
    }

    this.setBounds({
        x: figure.bounds.x + (figure.bounds.width - 7.5 * length) / 2,
        y: figure.bounds.y + (figure.bounds.height + 15) / 2,
    })
};

/*暂时使用的ID位置*/
export const idLocation = function (figure) {
    this.setBounds({
        x: figure.bounds.x + 20,
        y: figure.bounds.y + 15 + (figure.bounds.height - 15) / 2,
    })
}

/*连线端点的通用项*/
export const getAnchorOptions = function (type) {
    let options = {
        type,
        linkmyself: false,
    };

    if (type == 'out') Object.assign(options, {max: 1});

    return options;
}