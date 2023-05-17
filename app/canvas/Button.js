import {CanvasObject} from "./CanvasObject.js";

export class Button extends CanvasObject {

    buttonElement = document.createElement('button');

    constructor(config) {
        super(Object.assign({
        },config));
        this.data.name = this.generateName('Button');
        this.mergeData({
            text : 'Button'
        });
    }

    propConfig() {
        this.addDataDefinition('text',{
            type : 'text',
            label : 'Text'
        });
    }

    update() {
        super.update();
        this.buttonElement.innerText = this.config.data.text;
    }

    render() {
        this.content.innerHTML = '';
        this.content.appendChild(this.buttonElement);
        this.update();
    }

}