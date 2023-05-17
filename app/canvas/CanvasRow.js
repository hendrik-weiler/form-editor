export class CanvasRow {

    config = {};

    data = {};

    dataDefinition = {}

    container = document.createElement('div');

    constructor(config) {

        this.config = Object.assign({
            app : null
        }, config);

        this.data = this.config.data;

        this.container.classList.add('canvas-row');
        this.container.__instance__ = this;
    }

    appendToCanvas(node) {
        node.appendChild(this.container);
    }

    addField(field) {
        this.container.appendChild(field.container);
    }

    select() {}

    render() {
        let cos = this.container.querySelectorAll('.canvas-object'),
            i = 0;
        for(i; i < cos.length; ++i) {
            cos[i].__instance__.render();
        }
    }

}