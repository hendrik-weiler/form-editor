import {CanvasRow} from "./canvas/CanvasRow.js";

export class Options {

    config = {};

    app = null;

    node = null;

    tempDrag = null;

    dragging = false;

    draggingPlaced = false;

    downX = 0;

    downY = 0;

    currentElement = null;

    tempDragMove = null;

    isInRow = false;

    scrollIntervalId = -1;

    scrollAutoDirection = -1;

    lastMouseMoveEvent = null;

    definitions = [
        {
            id : 'Textbox',
            name : 'Textbox',
            icon : ''
        },
        {
            id : 'Selectbox',
            name : 'Selectbox',
            icon : ''
        },
        {
            id : 'RadioButtons',
            name : 'RadioButtons',
            icon : ''
        },
        {
            id : 'CheckBox',
            name : 'CheckBox',
            icon : ''
        },
        {
            id : 'Button',
            name : 'Button',
            icon : ''
        },
        {
            id : 'Headline',
            name : 'Headline',
            icon : ''
        },
        {
            id : 'Paragraph',
            name : 'Paragraph',
            icon : ''
        }
    ];

    constructor(config) {

        this.config = Object.assign({
            app : null,
            canvasScrollNode : document.body,
            tempDrag: document.body,
            tempDragMove: document.body
        }, config);

        this.app = config.app;

        this.tempDrag = this.config.tempDrag;

        this.tempDragMove = this.config.tempDragMove;

        this.node = this.app.config.options;
    }

    async mousedown(e) {
        if(e.target.classList.contains('option')) {
            let rect = e.target.getBoundingClientRect();
            this.tempDrag.innerHTML = '';
            this.tempDrag.style.width = rect.width + 'px';
            this.tempDrag.style.height = rect.height + 'px';
            this.tempDrag.dataset.id = e.target.dataset.id;
            this.tempDrag.appendChild(e.target.cloneNode(true));
            this.dragging = true;
            this.downX = e.pageX - rect.left;
            this.downY = e.pageY - rect.top + this.config.canvasScrollNode.scrollTop;
            this.tempDrag.classList.add('show');
            this.currentElement = await this.createCanvasObject(e.target.dataset.id);
            this.mousemove(e);
        }
        if(e.target.classList.contains('drag')) {
            let co = e.target.closest('.canvas-object');
            co.classList.add('placeholder');
            let rect = co.getBoundingClientRect(),
                coClone = co.cloneNode(true);
            coClone.classList.remove('select');
            coClone.classList.remove('placeholder');
            this.currentElement = co.__instance__;
            this.tempDragMove.innerHTML = '';
            this.tempDragMove.style.width = rect.width + 'px';
            this.tempDragMove.appendChild(coClone);
            this.downX = e.pageX - rect.left;
            this.downY = e.pageY - rect.top + this.config.canvasScrollNode.scrollTop;
            this.tempDragMove.classList.add('show');
            this.removeSelection();
            this.draggingPlaced = true;
        }
    }

    mousemove(e) {
        this.lastMouseMoveEvent = e;
        let top = e.pageY - this.downY,
            left = e.pageX - this.downX,
            scrollNodeRect = this.config.canvasScrollNode.getBoundingClientRect();

        if(this.dragging || this.draggingPlaced) {
            if(e.pageY < scrollNodeRect.top + 50) {
                this.scrollAutoDirection = 0;
            } else if(e.pageY > scrollNodeRect.bottom - 50) {
                this.scrollAutoDirection = 1;
            } else {
                this.scrollAutoDirection = -1;
            }
        }

        if(this.dragging) {
            this.tempDrag.style.top = (top) + 'px';
            this.tempDrag.style.left = (left) + 'px';
            this.isInRow = this.app.canvas.locateDrop(top, left, this.tempDrag.dataset.id);
        }
        if(this.draggingPlaced) {
            this.tempDragMove.style.top = (top) + 'px';
            this.tempDragMove.style.left = (left) + 'px';
            this.app.canvas.locateDropDrag(top + this.downY, left + this.downX);
        }
    }

    mouseup(e) {
        this.scrollAutoDirection = -1;
        if(this.dragging) {
            this.tempDrag.innerHTML = '';
            this.tempDrag.classList.remove('show');
            if(this.currentElement) {
                if(this.isInRow) {
                    this.currentElement = this.currentElement.container.querySelector('.canvas-object').__instance__;
                }
                this.app.canvas.replacePlaceholder(this.currentElement.container);
                this.currentElement.render();
                this.removeSelection();
                this.app.properties.showProperties(this.currentElement);
                this.currentElement.select();
                this.currentElement = null;
            }
            this.dragging = false;
            return;
        }
        if(this.draggingPlaced) {
            this.tempDragMove.classList.remove('show');
            this.currentElement.container.classList.remove('placeholder');
            this.draggingPlaced = false;

            if(!this.currentElement.container.closest('.canvas-row')) {
                let canvasRow = new CanvasRow({
                    app : this.app
                });
                this.currentElement.container.before(canvasRow.container);
                canvasRow.addField(this.currentElement);
            }

            this.currentElement.update();

            this.app.canvas.removeEmptyRows();

            return;
        }

        if(e.target.closest('.props')
            || e.target.closest('.delete')) {
            return;
        }

        this.removeSelection();
        let co;
        if(co = e.target.closest('.canvas-object')) {
            co.__instance__.select();
            this.app.properties.showProperties(co.__instance__);
        }
    }

    removeSelection() {
        let cos = this.app.canvas.node.querySelectorAll('.canvas-object'),
            i = 0;

        for(i; i < cos.length; ++i) {
            cos[i].__instance__.unselect();
        }
        this.app.properties.showUnselect();
    }

    async createCanvasObject(optionId) {
        const canvasRow = new CanvasRow({
            app : this.app
        });
        const module = await import('./canvas/' + optionId + '.js');
        if(module[optionId]) {
            let co = new module[optionId]({
                id : optionId,
                app : this.app,
                data : {width: 100}
            });
            canvasRow.addField(co);
            return canvasRow;
        }
        return null;
    }

    addOption(definition) {
        let container = document.createElement('div');
        container.innerHTML = definition.name;
        container.className = 'option';
        container.dataset.id = definition.id;
        this.node.appendChild(container);
    }

    render() {

        this.definitions.forEach(def => this.addOption(def));

        this.scrollIntervalId = setInterval(function () {
            if(this.scrollAutoDirection == 0) {
                this.config.canvasScrollNode.scrollTop -= 50;
                this.mousemove(this.lastMouseMoveEvent);
            }
            if(this.scrollAutoDirection == 1) {
                this.config.canvasScrollNode.scrollTop += 50;
                this.mousemove(this.lastMouseMoveEvent);
            }
        }.bind(this),300);

        document.body.addEventListener('mousedown', this.mousedown.bind(this));
        document.body.addEventListener('mousemove', this.mousemove.bind(this));
        document.body.addEventListener('mouseup', this.mouseup.bind(this));
    }
}