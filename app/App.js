import {Canvas} from "./Canvas.js";
import {Options} from "./Options.js";
import {Properties} from "./Properties.js";

export class App {

    config = {};

    canvas = null;

    options = null;

    properties = null;

    constructor(config) {

        this.config = Object.assign({
            ui : document.body,
            options : document.body,
            canvas : document.body,
            properties: document.body,
            tempDrag : document.body,
            tempDragMove : document.body
        }, config);

        this.canvas = new Canvas({
            app : this
        });

        this.options = new Options({
            app : this,
            tempDrag: this.config.tempDrag,
            tempDragMove : this.config.tempDragMove,
            canvasScrollNode : this.config.canvas.parentNode
        });
        this.options.render();

        this.properties = new Properties({
            app : this
        });

    }

    render() {
        this.properties.showUnselect();
    }
}