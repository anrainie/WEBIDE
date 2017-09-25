import {$AG} from "anrajs";

var control_for = {
    name: 'for',
    paletteUrl: 'assets/image/cwfEditor/Switch_16.gif',
    url: 'assets/image/cwfEditor/switch.png',
    type: $AG.IMAGE,
    size: [160, 44],
    canDrag: false,
    linekable: false,
    selectable: true,
    refresh() {
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
    }
};

var control_if = {
    name: 'if',
    paletteUrl: 'assets/image/cwfEditor/If_16.gif',
    url: 'assets/image/cwfEditor/blue.png',
    type: $AG.IMAGE,
    size: [80, 22],
    canDrag: true,
    linekable: false,
    selectable: true,
    refresh() {
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
    }
};

export var editorConfig = {
    id: 'nodeEditor',
    children: {
        'for': control_for,
        //'if': control_if
    },
    group: {
        '0': {
            name: '控制类',
            items: {
                'for': control_for,
                'if': control_if
            }
        },
        '1': {
            name: '组件类',
        }
    }
}