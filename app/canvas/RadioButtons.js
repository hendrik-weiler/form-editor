import {CanvasObject} from "./CanvasObject.js";

export class RadioButtons extends CanvasObject {

    label = document.createElement('label');

    optionContainer = document.createElement('div');

    constructor(config) {
        super(Object.assign({
        },config));
        this.data.name = this.generateName('RadioButtons');
        this.mergeData({
            label : 'Label',
            options : '1,Example,'
        });
    }

    propConfig() {
        this.addDataDefinition('label',{
            type : 'text',
            label : 'Label'
        });
        this.addDataDefinition('options',{
            type : 'grid',
            label : 'Options',
            gridDef : ['!radio','text:Label','!remove']
        });
    }

    update() {
        super.update();
        this.label.innerText = this.config.data.label;
        this.optionContainer.innerHTML = '';
        let data = this.data.options.split('\n'),
            i = 0,
            option,
            entryContainer,
            label,
            entry;

        for(i; i < data.length; ++i) {
            entry = data[i].split(',');
            entryContainer = document.createElement('div');
            option = document.createElement('input');
            option.type = 'radio';
            option.name = this.data.name;
            label = document.createElement('span');
            label.innerText = entry[1];
            if(entry[0]==1) {
                option.checked = true;
            }
            entryContainer.appendChild(option);
            entryContainer.appendChild(label);
            this.optionContainer.appendChild(entryContainer);
        }
    }

    render() {
        this.content.innerHTML = '';
        this.content.appendChild(this.label);
        this.content.appendChild(this.optionContainer);
        this.update();
    }

}