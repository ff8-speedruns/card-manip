import defaultSettings from './json/test.json' assert {type: 'json'};

let baseRng;

function init(settings) {
    baseRng = {};

    let mainContainer = document.getElementById('content');
    mainContainer.innerHTML = "";

    settings.forEach((node) => {
        // Begin building each section

        // Container
        let container = document.createElement('div');
        container.classList.add('col-12');

        let title = document.createElement('h2');
        title.classList.add('display-5', 'lh-1', 'mb-3');
        title.innerHTML = node.label;
        container.appendChild(title);

        // Base RNG
        if (!node.hasOwnProperty('baseCountPage')) {
            node.baseCountPage = node.label;
            baseRng[node.label] = parseInt(node.baseValue);
        }

        // Options
        node.categories.forEach((category) => {
            let categoryLabel = document.createElement('h5');
            categoryLabel.classList.add('mt-4');
            categoryLabel.innerHTML = category.label;
            console.warn(category.label);
            container.appendChild(categoryLabel);

            // The element
            category.subCategories.forEach((subCategory) => {
                if (subCategory.type.length == 0)
                    return;
                let times = subCategory.times || 1;

                let holder = document.createElement('div');

                if (times > 1) {
                    holder.classList.add('row');
                }

                // Loop for however many times this subcategory is repeated
                for (let i = 0; i < times; i++) {
                    // Create HTML element
                    let element = CreateElement(subCategory.type, subCategory.value, node.baseCountPage, subCategory.label);

                    // Add the element to our container.
                    holder.appendChild(element);
                }
                container.appendChild(holder);
            });

            // Append to DOM
            mainContainer.appendChild(container);
        })
    });
}

/********************************************/
/*********** Layout creation help ***********/
/********************************************/

function CreateElement(type, data, rngName, label = "") {
    switch (type) {
        case 'buttons':
            return CreateButtons(data, label, rngName);
            break;
        case 'radiobutton':
            return CreateRadioButtons(data, label, rngName);
            break;
        case 'list':
            return CreateList(data, label, rngName);
            break;
    }
}

// "button" actually represents checkboxes.
function CreateButtons(data, label, rngName) {
    let container = document.createElement('div');

    if (label.length > 0) {
        let title = document.createElement('span');
        title.innerHTML = label;
        container.appendChild(title);
    }

    // Create the checkboxes
    data.forEach((item) => {
        let optGroup = document.createElement('div');
        optGroup.classList.add('form-check', 'form-check-inline');

        // Create a unique id for label purposes
        let id = makeid(5);

        // Checkbox
        let box = document.createElement('input');
        box.classList.add('form-check-input');
        box.setAttribute("type", "checkbox");
        box.setAttribute("ff8-rng", rngName);
        box.value = item.value;
        box.id = id;
        optGroup.appendChild(box);

        // Label
        let elementLabel = document.createElement('label');
        elementLabel.classList.add('form-check-label');
        elementLabel.htmlFor = id;
        elementLabel.innerHTML = item.label;
        optGroup.appendChild(elementLabel);

        container.appendChild(optGroup);
    });

    return container;
}

function CreateRadioButtons(data, label, rngName) {
    let container = document.createElement('div');

    if (label.length > 0) {
        let title = document.createElement('span');
        title.innerHTML = label;
        container.appendChild(title);
    }

    // Create a shared name so the radio buttons are associated with each other.
    let radioName = makeid(5);

    // Create the radio buttons
    data.forEach((item) => {
        let optGroup = document.createElement('div');
        optGroup.classList.add('form-check', 'form-check-inline');

        // Create a unique id for label purposes
        let id = makeid(5);

        // Checkbox
        let radio = document.createElement('input');
        radio.classList.add('form-check-input');
        radio.setAttribute("type", "radio");
        radio.setAttribute("ff8-rng", rngName);
        radio.value = item.value;
        radio.id = id;
        radio.name = radioName;
        optGroup.appendChild(radio);

        // Label
        let elementLabel = document.createElement('label');
        elementLabel.classList.add('form-check-label');
        elementLabel.htmlFor = id;
        elementLabel.innerHTML = item.label;
        optGroup.appendChild(elementLabel);

        container.appendChild(optGroup);
    });

    return container;
}

function CreateList(data, label, rngName) {
    let container = document.createElement('div');
    container.classList.add('col-auto');

    // Create a unique id
    let id = makeid(5);

    if (label.length > 0) {
        let title = document.createElement('span');
        title.innerHTML = label;
        container.appendChild(title);
    }

    // Create the dropdown
    let select = document.createElement('select');
    select.id = id;
    container.appendChild(select);

    // Add the dropdown options
    data.forEach((item) => {
        let option = document.createElement('option');
        option.value = item.value;
        option.text = item.label;
        option.setAttribute("ff8-rng", rngName);
        select.appendChild(option);
    });

    return container;
}

function CalculateRng() {
    let div = document.getElementById('rng');
    div.innerHTML = "";
    // Iterate over each type of RNG we have
    for (const propName in baseRng) {
        let base = baseRng[propName];
        let mod = 0;

        // Get all values from select boxes
        const listmatches = document.querySelectorAll(`option[ff8-rng="${propName}"]:checked`).forEach((option) => {
            mod += parseInt(option.value);
        });

        // Get all values from checkboxes & radio buttons
        const checkmatches = document.querySelectorAll(`input[ff8-rng="${propName}"]:checked`).forEach((option) => {
            mod += parseInt(option.value);
        });

        let calculatedRng = base + mod;
        let p = document.createElement('p');
        p.innerHTML = `${propName} RNG: ${calculatedRng}`;
        div.appendChild(p);
    }
}

/********************************************/
/************* Helper functions *************/
/********************************************/

function makeid(length) {
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

// Read uploaded json file
function onFileReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    Reset(obj);
}

function Reset(settings) {
    init(settings);
    CalculateRng();
}

/********************************************/
/************* Event listeners **************/
/********************************************/

// Check for changes
window.addEventListener('input', function (evt) {
    CalculateRng();
});

// File upload
const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = onFileReaderLoad;
    reader.readAsText(file);

});

/********************************************/
/************* Let's get it on **************/
/********************************************/

Reset(defaultSettings);