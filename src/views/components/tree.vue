<template>
    <div class="tree">
        <item v-for='child in model' :model='child,config,msgHub' :key="child.path" :props="props" :ref="getProp(child,'label')">
        </item>
    </div>
</template>
<script type="text/javascript">
    import item from "../components/tree-item.vue";
    import Vue from 'vue'
    export default {
        name: 'tree',
        props: {
            model: {
                type:Array
            },
            config: {
                type:Object,
                default: function () {
                    return {};
                }
            },
            props: {
                default() {
                    return {
                        label:'label',
                        children: 'children',
                        desp:'desp'
                    };
                }
            }
        },
        components: {
            item: item
        },
        data() {
            return {
                selection: [],
                msgHub: new Vue(),
                ALL_LEVELS: -1
            }
        },
        watch: {
            selection(s){
                this.$emit('selectionChanged', s);
            }
        },
        methods: {
            getProp(model,key){
                if(this.props[key]){
                    key = this.props[key];
                }
                return model[key];
            },
            setInput(input){
                var self = this;
                this.model.slice(0, this.model.length);
                if ($.isArray(input)) {
                    $.each(input, function (k, v) {
                        this.self.model.push(v);
                    })
                } else {
                    this.model.push(input);
                }
            },
            /**
             * 展开到该节点并选中该节点
             * @param item
             */
            setSelection: function (item) {
                this.expandItem(item);
                item.handleClick();
            },

            /**
             * 选中事件
             * @param item
             * @param event
             * @private
             */
            _setSelection: function (item, event) {
                var needAdd = false;
                if (event && (event.ctrlKey || event.metaKey)) {
                    var exist = false;
                    for (var i = 0; i < this.selection.length; i++) {
                        var selected = this.selection[i];
                        if (selected === item) {
                            var oldSelected = this.selection[i];
                            this.selection.splice(i, 1);
                            oldSelected.selected = false;
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) {
                        needAdd = true;
                    }
                } else if (this.selection.length > 1) {
                    for (var i = 0; i < this.selection.length; i++) {
                        this.selection[i].selected = false;
                    }
                    this.selection.splice(0, this.selection.length);
                    needAdd = true;
                } else if (this.selection.length == 1) {
                    if (!this.isSelected(item)) {
                        var old = this.selection.pop();
                        old.selected = false;
                        needAdd = true;
                    }else{
                        item.selected = true;
                        item.selected = true;
                    }
                } else if (this.selection.length == 0) {
                    needAdd = true;
                }
                if (needAdd) {
                    if (!item.selected) {
                        item.selected = true;
                    }
                    this.selection.push(item);
                }
            },
            removeSelection: function (item) {
                for (var i = 0; i < this.selection.length; i++) {
                    var selected = this.selection[i];
                    if (selected === item) {
                        this.selection.splice(i, 1);
                        break;
                    }
                }
            },
            isSelected: function (item) {
                for (var i = 0; i < this.selection.length; i++) {
                    var selected = this.selection[i];
                    if (selected === item) {
                        return true;
                    }
                }
                return false;
            },
            getItem: function (path) {
                //   path:/hello/heii/aaaa/flow/flowConfig.fc
                var paths = path.split("/");
                var reachedNode = this;
                for (let i = 1; i < paths.length; i++) {
                    var children = reachedNode.getChildren();
                    for(let j = 0 ; j < children.length ; j++){
                        var child = children[j];
                        if(child.model.name === paths[i]){
                            reachedNode = child;
                            if (i === paths.length - 1) {
                                return reachedNode;
                            }
                            break;
                        }
                    }
                }
            },
            getCheckedItems: function () {
                var checkedItems = [];
                if (this.config.check) {
                    var children = this.$children;
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        if (child.checked) {
                            checkedItems.push(child);
                            checkedItems = checkedItems.concat(child.getCheckedItems());
                        }
                    }
                }
                return checkedItems;
            },
            deleteItem: function (item) {
                let self = this;
                let parent = item.getParent();
                let children;
                if(parent === this){
                    children = this.model;
                }else{
                    children = this.getProp(parent.model,'children');
                }
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    if (this.getProp(child,'label') === this.getProp(item.model,'label')) {
                        children.splice(i, 1);
                        if (item.selected) {
                            self.removeSelection(item);
                        }
                        if (this.config.callback.delete) {
                            this.config.callback.delete.call(this,item);
                        }
                        return true;
                    }
                }
                return false;
            },
            getChildren: function () {
                return this.$children;
            },

            /**
             * 展开节点
             * @param item
             */
            expandItem: function (item) {
                let parent = item.getParent();
                while (parent && parent !== this) {
                    if (!parent.open) {
                        parent.toggle();
                    }
                    parent = parent.getParent();
                }
            },

            /**
             * 展开所有节点
             */
            expandAll: function () {
                this.expandToLevel(this.ALL_LEVELS)
            },

            /**
             * 从item节点开始展开指定层数
             * @param level
             * @param item
             */
            expandToLevel: function (level, item) {
                item = item || this;
                this._internalExpandToLevel(item, level);
            },
            _internalExpandToLevel: function (item, level) {
                if (level === this.ALL_LEVELS || level > 0) {
                    var children = item.getChildren();
                    for (var index in children) {
                        var child = children[index];
                        child.toggle();
                        var newLevel = (level === this.ALL_LEVELS ? this.ALL_LEVELS : level - 1);
                        this._internalExpandToLevel(child, newLevel);
                    }
                }
            },
            collapseAll: function () {
                this.collapseToLevel(this.ALL_LEVELS, this);
            },
            /**
             * 从item节点开始收缩
             * @param item
             * @param level
             */
            collapseToLevel: function (level, item) {
                this._internalCollapseToLevel(level, item);
            },
            _internalCollapseToLevel(level, item){
                if (level === this.ALL_LEVELS || level > 0) {
                    var children = item.getChildren();
                    for (var index in children) {
                        var child = children[index];
                        child.toggle();
                        var newLevel = (level === this.ALL_LEVELS ? this.ALL_LEVELS : level - 1);
                        this._internalExpandToLevel(child, newLevel);
                    }
                }
            },
            /**
             * 刷新节点，可指定刷新层数。如果是异步加载刷新行为取决于config中的asyncLoadItem接口的实现
             * @param path
             * @param level
             */
            refresh: function (path, level) {
                if (!path) {
                    let self = this;
                    self.init(function (m) {
                        self.model = m;
                    });
                    return;
                }
                let item = this.getItem(path);
                if (item) {
                    item.refresh(level);
                }
            },

        },
        mounted: function () {
            var self = this;

            this.config.callback = this.config.callback || {};
            if (!this.model) {
                this.model = [];
            }
            if (this.config.width) {
                this.$el.style.width = this.config.width;
            }
            this.msgHub.$on("deleteItem", function (item) {
                self.deleteItem(item);
            });
            this.msgHub.$on("setSelected", function (item, event) {
                self._setSelection(item, event);
            });

        },
        created: function () {
        },
        beforeDestory: function () {
            this.msgHub.$destroy();
        }
    }
</script>

<style>
    .tree {
        padding-left: 10px;
        color: #E5E9F2;
        -webkit-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;
    }
</style>

