import {$AG, constants, smoothRouter} from 'anrajs'
import * as globalConstants from 'Constants'
import {Terminals, Terminal, Name} from '../propsName'

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
        'stroke-width': 3
    },
    type: $AG.CURVE_LINE,
    router: smoothRouter(),
    endMarker: {
        type: $AG.Marker.TRIANGLE,
        size: 3
    },
    selectable: true
};

//策略
export const openPropEditor = {
    activate(){
        this.lisn = () => {
            debugger;
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

export const pinPolicy = function (idList) {
    return {
        activate() {
            if (idList) {
                this.handles = idList.map((id) => (new pinHandle(this.getHost(), id)));
                this.handles.forEach((item) => {
                    this.getHandleLayer().addChild(item);
                    item.disableEvent();
                });
            }
        },

        deactivate() {
            if (this.handles) {
                this.handles.forEach((item) => {
                    this.getHandleLayer().removeChild(item);
                });
            }
        }
    }
};

export const terminalPolicy = function ({isListen = false} = {}) {
    return {
        getTerminals() {
            let terminls = this.getHost().model.get(Terminals);

            //可能xml转json，数组和对象的差异
            return terminls && terminls[Terminal] ? [].concat(terminls[Terminal]) : [];
        },
        createPinHandle({Name}) {
            if (Name == null) return null;

            if (this.getHost().getSourceAnchorByTerminal(Name) == null) return null;

            return new pinHandle(this.getHost(), Name);
        },
        activate() {
            if (isListen) {
                //注：与model数据同步
                this.handles = new Map();
                this.getTerminals().forEach(item => {
                   let pin = this.createPinHandle(item);

                    if (pin) {
                        this.handles.set(item.Name, pin);
                        this.getHandleLayer().addChild(pin);
                    }
                });

                this.listener = () => {
                    let terminals = new Map(this.getTerminals()),
                        adds = [...terminals.keys()].filter(name => !this.handles.has(name)),
                        removes = [...this.handles].filter(([name, handle]) => !terminals.has(name));

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
                    let pin = this.createPinHandle(item);

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