import {$AG} from "anrajs";

export let cwf = $AG.Editor.extend({
    constructor(config) {
        $AG.Editor.prototype.constructor.call(this, config);
        this.rootEditPart.setLayout(new $AG.Layout.GRID({
            numColumns: 1,
            makeColumnsEqualWidth: true,
            makeRowsEqualHeight: false,
            autoAdapt: true,
            horizontalAutoAdapt: true,
            verticalAutoAdapt: false
        }));
    },
    createCanvas(id) {
        var canvas = $AG.Editor.prototype.createCanvas.call(this, id);

        canvas.owner.style.width = "100%";

        return canvas;
    }
});