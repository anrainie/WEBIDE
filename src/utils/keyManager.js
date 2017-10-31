import 'jquery';


const keyMananger = function () {
    let a;

    document.onkeydown = function (event) {
        if (event.ctrlKey && (event.keyCode == 83 || event.keyCode == 65 || event.keyCode == 112 ))
            return false;
    };

    this.registKey = (handle) => {

    };

    this.active = (target) => {
        a = target;
    };

    let keyHandle = function (e) {
        var keys = [];
        if (e.altKey)
            keys.push('alt');
        if (e.ctrlKey)
            keys.push('ctrl');
        if (e.shiftKey)
            keys.push('shift');
        keys.push(e.key.toLowerCase());
        return this.handles.get(keys.sort().join('+'));
    };

    $(document).keydown((e) => {
        if (a && a.keydown(e) === false)return false;

    });

    $(document).keyup((e) => {
        if (a && a.keyup(e) === false)return false;
        console.log('全局处理',e);
    });

    return this;
};


export default keyMananger;