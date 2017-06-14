<!--
menu
{
                    id: 0,
                    name: 'undo',
                    type: ACTION_STACK,
                    key: 'ctrl+z',
                    run: function () {
                        this.host.undo();
                    },
                    check: function () {
                        return this.host.canUndo();
                    }
                }
-->