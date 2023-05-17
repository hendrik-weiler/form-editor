import {CanvasObject} from "./CanvasObject.js";

export class Selectbox extends CanvasObject {

    label = document.createElement('label');

    input = document.createElement('select');

    constructor(config) {
        super(Object.assign({
        },config));
        this.data.name = this.generateName('SelectBox');
        this.mergeData({
            label : 'Label',
            value : '1,(None),'
        });
    }

    propConfig() {
        this.addDataDefinition('label',{
            type : 'text',
            label : 'Label'
        });
        this.addDataDefinition('value',{
            type : 'grid',
            label : 'Value',
            gridDef : ['!radio','text:Value','!remove']
        });
    }

    update() {
        super.update();
        this.label.innerText = this.config.data.label;
        this.input.innerHTML = '';
        this.input.disabled = true;
        let data = this.data.value.split('\n'),
            i = 0,
            option,
            entry;

        for(i; i < data.length; ++i) {
            entry = data[i].split(',');
            option = document.createElement('option');
            if(entry[0]==1) {
                option.selected = true;
            }
            option.value = entry[1];
            option.innerHTML = entry[1];
            this.input.appendChild(option);
        }
    }

    render() {
        this.content.innerHTML = '';
        this.content.appendChild(this.label);
        this.content.appendChild(this.input);
        this.update();
    }

}