export class CanvasObject {

    config = {};

    data = {};

    dataDefinition = {
        'name' : {
            type : 'text',
            label : 'Name'
        },
        'width' : {
            type : 'range',
            min: 10,
            max: 100,
            step: 10,
            label : 'Width'
        }
    }

    container = document.createElement('div');

    content = document.createElement('div');

    options = document.createElement('div');

    drag = document.createElement('img');

    constructor(config) {

        this.config = Object.assign({
            id : 'co',
            data : {},
            app : null
        }, config);

        this.data = this.config.data;

        this.data.name = this.generateName('co');

        this.container.classList.add('canvas-object');
        this.container.classList.add(this.config.id);
        this.container.__instance__ = this;

        this.container.appendChild(this.content);
        this.content.classList.add('co-content');

        this.container.appendChild(this.options);
        this.options.classList.add('co-options');

        this.drag = new Image;
        this.drag.src = 'img/drag.svg';
        this.drag.classList.add('drag');
        this.options.appendChild(this.drag);

        this.delete = new Image;
        this.delete.src = 'img/delete.svg';
        this.delete.classList.add('delete');
        this.delete.onclick = function () {
            this.container.remove();
            this.config.app.canvas.removeEmptyRows();
            if(this.isSelected()) {
                this.config.app.properties.showUnselect();
            }
        }.bind(this);
        this.options.appendChild(this.delete);

        this.propConfig();
    }

    mergeData(data) {
        let dataMerged = Object.assign(this.config.data, data);
        this.data = dataMerged;
    }

    generateName(name) {
        let objects = this.config.app.config.canvas.querySelectorAll('.canvas-object'),
            i = 0,
            obj,
            sameNameCounter = 1;

        for(i; i < objects.length; ++i) {
            obj = objects[i];
            if(obj.__instance__.data.name == name
            || new RegExp(name + '_[0-9]+').test(obj.__instance__.data.name)) {
                sameNameCounter++;
            }
        }

        if(sameNameCounter>1) {
            name += '_' + sameNameCounter;
        }

        return name;

    }

    propConfig() {}

    addDataDefinition(name, definition) {
        this.dataDefinition[name] = definition;
    }

    showPlaceholder() {
        this.container.classList.add('placeholder');
    }

    removePlaceholder() {
        this.container.classList.remove('placeholder');
    }

    select() {
        this.container.classList.add('select');
    }

    isSelected() {
        return this.container.classList.contains('select');
    }

    unselect() {
        this.container.classList.remove('select');
    }

    appendToCanvas(node) {
        node.appendChild(this.container);
    }

    render() {}

    update() {
        this.container.style.width = this.data.width + '%';
    }

}