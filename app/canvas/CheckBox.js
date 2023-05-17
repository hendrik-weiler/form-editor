import {CanvasObject} from "./CanvasObject.js";

export class CheckBox extends CanvasObject {

    label = document.createElement('span');

    boxContainer = document.createElement('span');

    constructor(config) {
        super(Object.assign({
        },config));
        this.data.name = this.generateName('CheckBox');
        this.mergeData({
            label : 'Label',
            active : false
        });
    }

    propConfig() {
        this.addDataDefinition('label',{
            type : 'text',
            label : 'Label'
        });
        this.addDataDefinition('active',{
            type : 'bool',
            label : 'Active'
        });
    }

    update() {
        super.update();
        this.label.innerText = this.config.data.label;
        this.boxContainer.innerHTML = '';
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = 1;
        checkbox.disabled = true;
        if(this.data.active) {
            checkbox.checked = true;
        }
        this.boxContainer.appendChild(checkbox);
    }

    render() {
        this.content.innerHTML = '';
        this.content.appendChild(this.boxContainer);
        this.content.appendChild(this.label);
        this.update();
    }

}