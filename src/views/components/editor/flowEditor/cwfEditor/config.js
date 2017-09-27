import {$AG} from "anrajs";
import {ContainerLayoutPolicy} from './editor'

let refresh = function () {
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

let control_if = {
    name: 'if',
    paletteUrl: 'assets/image/cwfEditor/If_16.gif',
    url: 'assets/image/cwfEditor/blue.png',
    type: $AG.IMAGE,
    size: [160, 44],
    canDrag: true,
    linekable: false,
    selectable: true,
    refresh,
    policies: {
        'layoutPolicy': ContainerLayoutPolicy
    },
    layout: {
        type: 'GRID',
        arguments: {
            numColumns: 1,
            makeColumnsEqualWidth: true,
            makeRowsEqualHeight: false,
            horizontalAutoAdapt: true,
            verticalAutoAdapt: false
        },
        data: {

        }
    }
};

let control_default = {
    name: 'default',
    paletteUrl: 'assets/image/cwfEditor/Default_16.gif',
    url: 'assets/image/cwfEditor/blue.png',
    type: $AG.IMAGE,
    size: [160, 44],
    canDrag: true,
    linekable: false,
    selectable: true,
    refresh,
    policies: {
        'layoutPolicy': ContainerLayoutPolicy
    }
}


let control_switch = {
    name: 'switch',
    paletteUrl: 'assets/image/cwfEditor/Switch_16.gif',
    url: 'assets/image/cwfEditor/switch.png',
    type: $AG.IMAGE,
    size: [320, 88],
    canDrag: true,
    linekable: false,
    selectable: true,
    refresh,
    policies: {
        'layoutPolicy': ContainerLayoutPolicy
    }
};

let control_while = {
    name: 'while',
    paletteUrl: 'assets/image/cwfEditor/While_16.gif',
    url: 'assets/image/cwfEditor/blue.png',
    type: $AG.IMAGE,
    size: [320, 88],
    canDrag: true,
    linekable: false,
    selectable: true,
    refresh,
    children: {
    },
    policies: {
        'layoutPolicy': ContainerLayoutPolicy
    }
};

let control_for = {
    name: 'for',
    paletteUrl: 'assets/image/cwfEditor/For_16.gif',
    url: 'assets/image/cwfEditor/blue.png',
    type: $AG.IMAGE,
    size: [320, 88],
    canDrag: true,
    linekable: false,
    selectable: true,
    refresh,
    children: {
    },
    policies: {
        'layoutPolicy': ContainerLayoutPolicy
    }
};

let control_sql = {
    name: 'sql',
    paletteUrl: 'assets/image/cwfEditor/Sql_16.gif',
    url: 'assets/image/cwfEditor/blue.png',
    type: $AG.IMAGE,
    size: [320, 88],
    canDrag: true,
    linekable: false,
    selectable: true,
    refresh,
    policies: {
        'layoutPolicy': ContainerLayoutPolicy
    }
};

control_if.children = {
    'switch': control_switch,
    'for': control_for,
    'while': control_while,
    'sql': control_sql
}

control_default.children = {
    'switch': control_switch,
    'for': control_for,
    'while': control_while,
    'sql': control_sql
}

control_switch.children = {
    'if': control_if,
    'defualt': control_default
}

control_while.children = {
    'switch': control_switch,
    'for': control_for,
    'while': control_while,
    'sql': control_sql
}

control_for.children = {
    'switch': control_switch,
    'for': control_for,
    'while': control_while,
    'sql': control_sql
}

control_sql.children = {
    'switch': control_switch,
    'for': control_for,
    'while': control_while,
    'sql': control_sql
}

export let editorConfig = {
    id: 'nodeEditor',
    children: {
        'switch': control_switch,
        'for': control_for,
        'while': control_while,
        'sql': control_sql
    },
    group: {
        '0': {
            name: '控制类',
            items: {
                'switch': control_switch,
                'if': control_if,
                'defualt': control_default,
                'for': control_for,
                'while': control_while,
                'sql': control_sql
            }
        },
        '1': {
            name: '组件类',
        }
    }
}