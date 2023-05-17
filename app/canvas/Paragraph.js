import {CanvasObject} from "./CanvasObject.js";

export class Paragraph extends CanvasObject {

    label = document.createElement('p');

    constructor(config) {
        super(Object.assign({
        },config));
        this.data.name = this.generateName('Paragraph');
        this.mergeData({
            text : 'Paragraph',
            size : 12
        });
    }

    propConfig() {
        this.addDataDefinition('text',{
            type : 'textarea',
            label : 'Text'
        });
        this.addDataDefinition('size',{
            type : 'range',
            min: 10,
            max : 40,
            step: 1,
            label : 'Size'
        });
    }

    update() {
        super.update();
        this.label.innerText = this.config.data.text;
        this.label.style.fontSize = this.config.data.size + 'px';
    }

    render() {
        this.content.innerHTML = '';
        this.content.appendChild(this.label);
        this.update();
    }

}