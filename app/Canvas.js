import {Placeholder} from "./canvas/Placeholder.js";
import {CanvasRow} from "./canvas/CanvasRow.js";

export class Canvas {

    config = {};

    app = null;

    node = null;

    placeholder = null;

    constructor(config) {

        this.config = Object.assign({
            app : null
        }, config);

        this.app = config.app;
        this.placeholder = new Placeholder({id:'placeholder', app : this.app});

        this.node = this.app.config.canvas;
    }

    replacePlaceholder(option) {
        this.placeholder.container.replaceWith(option);
    }

    locateDrop(top, left, optionId) {
        let canvasRect = this.node.getBoundingClientRect(),
            isInRow = false;

        if(top > canvasRect.top
            && left > canvasRect.left) {

            let rowObjects = this.node.querySelectorAll('.canvas-row'),
                i,
                j,
                canvasObjects,
                row,
                rowRect,
                obj,
                objRect;
            if(rowObjects.length==0) {
                this.node.appendChild(this.placeholder.container);
            } else {

                if(rowObjects.length > 0) {
                    row = rowObjects[0];
                    rowRect = row.getBoundingClientRect();
                    if(top < rowRect.y) {
                        row.before(this.placeholder.container);
                    }

                    row = rowObjects[rowObjects.length-1];
                    rowRect = row.getBoundingClientRect();
                    if(top > rowRect.y) {
                        row.after(this.placeholder.container);
                    }
                }

                for (i=0; i < rowObjects.length; ++i) {
                    row = rowObjects[i];
                    rowRect = row.getBoundingClientRect();
                    if(top > rowRect.top
                    && top < rowRect.bottom) {
                        row.before(this.placeholder.container);
                        canvasObjects = row.querySelectorAll('.canvas-object');

                        if(canvasObjects.length>0) {
                            obj = canvasObjects[0];
                            objRect = obj.getBoundingClientRect();
                            if(top > objRect.top + 5
                                && left < objRect.left + objRect.width/2) {
                                obj.before(this.placeholder.container);
                                isInRow = true;
                                break;
                            }
                        }

                        for(j=0;j < canvasObjects.length; ++j) {
                            obj = canvasObjects[j];
                            objRect = obj.getBoundingClientRect();
                            if(top > objRect.top + 5
                                && left > objRect.left + objRect.width/2) {
                                obj.after(this.placeholder.container);
                                isInRow = true;
                            }
                        }
                    }
                }
            }
        }

        return isInRow;
    }

    removeEmptyRows() {
        let rowObjects = this.node.querySelectorAll('.canvas-row:empty'),
            i;

        for(i=0; i < rowObjects.length; ++i) {
            rowObjects[i].remove();
        }
    }

    locateDropDrag(top, left) {
        let rowObjects = this.node.querySelectorAll('.canvas-row'),
            i = 0,
            j,
            row,
            rowRect,
            canvasObjects,
            obj,
            objRect,
            width = 0;

        if(rowObjects.length > 0) {
            row = rowObjects[0];
            rowRect = row.getBoundingClientRect();
            if(top < rowRect.y) {
                row.before(this.app.options.currentElement.container);
            }

            row = rowObjects[rowObjects.length-1];
            rowRect = row.getBoundingClientRect();
            if(top > rowRect.y) {
                row.after(this.app.options.currentElement.container);
            }
        }

        for (i=0; i < rowObjects.length; ++i) {
            row = rowObjects[i];
            rowRect = row.getBoundingClientRect();
            if(top > rowRect.top
                && top < rowRect.bottom) {
                row.before(this.app.options.currentElement.container);
                canvasObjects = row.querySelectorAll('.canvas-object');

                if(canvasObjects.length>0) {
                    obj = canvasObjects[0];
                    objRect = obj.getBoundingClientRect();
                    if(top > objRect.top + 5
                        && left < objRect.left + objRect.width) {
                        obj.before(this.app.options.currentElement.container);
                        break;
                    }
                }

                for(j=0;j < canvasObjects.length; ++j) {
                    obj = canvasObjects[j];
                    objRect = obj.getBoundingClientRect();
                    if(top > objRect.top + 5
                        && left > objRect.left - objRect.width) {
                        obj.before(this.app.options.currentElement.container);
                    }
                }

                obj = canvasObjects[canvasObjects.length-1];
                objRect = obj.getBoundingClientRect();
                if(top > objRect.top + 5
                    && left > objRect.left) {
                    obj.after(this.app.options.currentElement.container);
                }
            }
        }

        objRect = this.app.options.currentElement.container.getBoundingClientRect();

        return objRect.width;
    }

    render() {


    }
}