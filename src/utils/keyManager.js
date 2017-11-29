import 'jquery';


const keyMananger = function (type) {
    let a;
    let pages = [];
    let handles = {};


    this.bind = (key, handle) => {
        let keys = key.toLowerCase().split('+');
        return handles[keys.sort().join('+')] = handle;
    };

    this.unbind = (key) => {
        let keys = key.toLowerCase().split('+');
        handles[keys.sort().join('+')] = null;
    };

    this.exec = (c, e, type = 'keyup') => {
        if (c)
            if (typeof(c) == 'function') {
                return c(e);
            } else
                return c[type] && c[type](e);
    };

    this.getHandle = function (e) {
        let keys = [];
        if (e.altKey)
            keys.push('alt');
        if (e.ctrlKey)
            keys.push('ctrl');
        if (e.shiftKey)
            keys.push('shift');
        keys.push(e.key.toLowerCase());
        return handles[keys.sort().join('+')];
    };
    this.keydown = (e) => {
        if (e.key == null)return;
        if (this.exec(a, e, 'keydown') === false)return false;
        if (this.exec(this.getHandle(e), e, 'keydown') === false)return false;
    };
    this.keyup = (e) => {
        if (e.key == null)return;
        if (this.exec(a, e) === false)return false;
        if (this.exec(this.getHandle(e), e) === false)return false;
    };

    if (type == 'global') {
        this.active = (el) => {
            if (el == null) {
                a = null;
                return;
            }
            if (el.__watchId && pages[el.__watchId - 1] == el) {
                a = el.__keyHandle;
            }
        };
        this.watchPage = (el, handle) => {
            if (el.__watchId && pages[el.__watchId - 1] == el) {
                a = el.__keyHandle;
                return;
            }
            el.__bindClick = () => {
                a = handle;
            };
            $(el).bind('click', el.__bindClick);
            pages.push(el);
            el.__watchId = pages.length;
            el.__keyHandle = handle;
        };

        this.unwatchPage = (el) => {
            if (el.__watchId && pages[el.__watchId - 1] == el) {
                $(el).unbind('click', el.__bindClick);
                if (a == el.__keyHandle) a = null;
                pages.splice(el.__watchId - 1, 1);
                /*delete  el._watchId;
                delete  el._keyHandle;*/
                el._watchId = null;
                el._keyHandle = null;
            }
        };

        //因为keyManager持有DOM节点引用
        this.unwatchAllPage = () => {
            while(pages.length > 0) {
                this.unwatchPage(pages[0]);
            }
            //pages.forEach((el) => this.unwatchPage(el));
            a = null;
        };

        $(document).keydown((e) => {
            if (this.keydown(e) === false)
                return false;
            if (e.ctrlKey && (e.keyCode == 83 || e.keyCode == 65 || e.keyCode == 112 ))
                return false;
        });

        $(document).keyup(this.keyup);
    }
    return this;
};


export default keyMananger;