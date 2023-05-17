import {CanvasObject} from "./CanvasObject.js";

export class Textbox extends CanvasObject {

    label = document.createElement('label');

    input = document.createElement('input');

    constructor(config) {
        super(Object.assign({

        },config));
        this.data.name = this.generateName('Textbox');
        this.mergeData({
            label : 'Label',
            type : 'text'
        });
    }

    propConfig() {
        this.addDataDefinition('label',{
            type : 'text',
            label : 'Label'
        });
    }

    update() {
        super.update();
        this.label.innerText = this.config.data.label;
        this.input.type = this.config.data.type;
    }

    render() {
        this.content.innerHTML = '';
        this.content.appendChild(this.label);
        this.content.appendChild(this.input);
        this.update();
    }

}