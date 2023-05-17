export class Properties {

    config = {};

    app = null;

    node = null;

    constructor(config) {

        this.config = Object.assign({
            app : null
        }, config);

        this.app = config.app;

        this.node = this.app.config.properties;
    }

    showUnselect() {
        this.node.innerHTML = 'Select an element to edit its properties.';
    }

    addStandardProperty(def) {
        let container = document.createElement('div'),
            label = document.createElement('label');

        container.classList.add('property');
        label.innerText = def.label;

        container.appendChild(label);
        return container;
    }

    addTextProperty(name, def, optionInstance) {
        let propContainer = this.addStandardProperty(def),
            input = document.createElement('input');

        input.type = 'text';
        input.oninput = function () {
            optionInstance.data[name] = this.value;
            optionInstance.update();
        }
        input.value = optionInstance.data[name];

        propContainer.appendChild(input);
        return propContainer;
    }

    addTextareaProperty(name, def, optionInstance) {
        let propContainer = this.addStandardProperty(def),
            input = document.createElement('textarea');

        input.style.height = '200px';
        input.oninput = function () {
            optionInstance.data[name] = this.value;
            optionInstance.update();
        }
        input.value = optionInstance.data[name];

        propContainer.appendChild(input);
        return propContainer;
    }

    addBoolProperty(name, def, optionInstance) {
        let propContainer = this.addStandardProperty(def),
            input = document.createElement('input');

        input.type = 'checkbox';
        input.onchange = function () {
            optionInstance.data[name] = this.checked;
            optionInstance.update();
        }
        input.checked = optionInstance.data[name];

        propContainer.appendChild(input);
        return propContainer;
    }

    addRangeProperty(name, def, optionInstance) {
        let propContainer = this.addStandardProperty(def),
            input = document.createElement('input');

        input.type = 'range';
        input.min = def.min;
        input.max = def.max;
        input.step = def.step;
        input.oninput = function () {
            optionInstance.data[name] = this.value;
            optionInstance.update();
        }
        input.value = optionInstance.data[name];

        propContainer.appendChild(input);
        return propContainer;
    }

    addGridRow(fields, data, index, name, optionInstance, propContainer) {
        let tr = document.createElement('tr'),
            temp = data.split(','),
            i,
            fieldName;

        for(i=0; i < fields.length; ++i) {
            fieldName = fields[i];
            let td = document.createElement('td'),
                removeBtn,
                radioInput,
                textInput;

            if(fieldName == '!remove') {
                removeBtn = document.createElement('button');
                removeBtn.innerText = 'Delete';
                removeBtn.onclick = function (e) {
                    let tr = e.currentTarget.closest('tr');
                    tr.remove();
                    this.updateGridProperties(name, optionInstance, propContainer);
                }.bind(this);
                td.appendChild(removeBtn);
            } else if(fieldName == '!radio') {
                radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = name;
                radioInput.value = 1;
                radioInput.onclick = function () {
                    this.updateGridProperties(name, optionInstance, propContainer);
                }.bind(this);
                if(temp[i] == 1) {
                    radioInput.checked = true;
                }
                td.appendChild(radioInput);
            } else {
                textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.value = temp[i];
                textInput.oninput = function () {
                    this.updateGridProperties(name, optionInstance, propContainer);
                }.bind(this);
                td.appendChild(textInput);
            }
            tr.appendChild(td);

        }

        return tr;
    }

    addGridHead(head) {
        let tr = document.createElement('tr'),
            i = 0;

        for(i; i < head.length; ++i) {
            let th = document.createElement('th');
            th.innerText = head[i];
            tr.appendChild(th);
        }

        return tr;
    }

    addGridProperty(name, def, optionInstance) {
        let propContainer = this.addStandardProperty(def),
            table = document.createElement('table'),
            addNewBtn = document.createElement('button'),
            i,
            val,
            temp,
            head = [],
            fields = [],
            data = optionInstance.data[name].split('\n');

        for (i=0; i < def.gridDef.length; ++i) {
            val = def.gridDef[i];
            temp = val.split(':');
            if(temp.length == 2) {
                head.push(temp[1]);
                fields.push(temp[0]);
            } else {
                if(val[0]=='!') {
                    if(/radio/.test(val)) {
                        head.push('Default');
                    }
                    if(/remove/.test(val)) {
                        head.push('Options');
                    }
                    fields.push(val);
                }
            }
        }

        let headElm = this.addGridHead(head);
        table.appendChild(headElm);

        console.log(data,head)
        for(i=0; i < data.length; ++i) {
            let dataElm = this.addGridRow(
                fields, data[i], i, name, optionInstance, propContainer);
            table.appendChild(dataElm);
        }

        addNewBtn.innerText = 'Add entry';
        addNewBtn.onclick = function () {
            let trs = table.querySelectorAll('tr'),
                dataElm = this.addGridRow(
                    fields, head.join(','), trs.length, name, optionInstance, propContainer);
            table.appendChild(dataElm);
            this.updateGridProperties(name, optionInstance, propContainer);
        }.bind(this);

        propContainer.appendChild(table);
        propContainer.appendChild(addNewBtn);
        return propContainer;
    }

    updateGridProperties(name, optionInstance, propContainer) {
        let trs = propContainer.querySelectorAll('tr'),
            i = 1,
            data = [],
            tds,
            j,
            entryData,
            input,
            button;

        for(i; i < trs.length; ++i) {
            tds = trs[i].querySelectorAll('td');
            entryData = [];
            for(j=0; j < tds.length; ++j) {
                input = tds[j].querySelector('input');
                button = tds[j].querySelector('button');
                console.log(input,button)
                if(input) {
                    if(input.type == 'radio') {
                        entryData.push(input.checked ? 1 : '');
                    } else {
                        entryData.push(input.value);
                    }
                }
                if(button) {
                    entryData.push('');
                }
            }
            data.push(entryData.join(','));
        }

        optionInstance.data[name] = data.join('\n');
        optionInstance.update();
    }

    showProperties(optionInstance) {
        console.log(optionInstance)
        this.node.innerHTML = '';

        let def,
            propContainer;
        for (let name in optionInstance.dataDefinition) {
            def = optionInstance.dataDefinition[name];

            switch (def.type) {
                case 'textarea':
                    propContainer  = this.addTextareaProperty(name, def, optionInstance);
                    break;
                case 'bool':
                    propContainer  = this.addBoolProperty(name, def, optionInstance);
                    break;
                case 'range':
                    propContainer  = this.addRangeProperty(name, def, optionInstance);
                    break;
                case 'text':
                    propContainer  = this.addTextProperty(name, def, optionInstance);
                    break;
                case 'grid':
                    propContainer  = this.addGridProperty(name, def, optionInstance);
                    break;
            }

            this.node.appendChild(propContainer);

        }

    }

}