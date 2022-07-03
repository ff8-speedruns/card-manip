import settings from './json/test.json' assert {type: 'json'};

let baseRng = 0;

settings.forEach((node) => {
    // Begin building each section

    // Container
    let container = document.createElement('div');
    let title = document.createElement('h2');
    title.innerHTML = node.label;
    container.appendChild(title);

    // Base RNG
    baseRng += node.baseValue;

    // Options
    node.categories.forEach((category) => {
        let categoryLabel = document.createElement('h5');
        categoryLabel.innerHTML = category.label;
        container.appendChild(categoryLabel);

        // The element
        category.subCategories.forEach((subCategory) => {
            let times = subCategory.times || 1;
            
            let holder = document.createElement('div');

            if (times > 1) {
                holder.classList.add('row');
            }

            // Loop for however many times this subcategory is repeated
            for (let i = 0; i < times; i++) {
                // Create HTML element
                let element = CreateElement(subCategory.type, subCategory.value, subCategory.label);

                // Add the element to our container.
                holder.appendChild(element);
            }
            container.appendChild(holder);
        });
    })

    // Put it all together
    document.body.appendChild(container);
    console.log(`Initialized. Base RNG = ${baseRng}`);
});


// Layout creation help
function CreateElement(type, data, label = "") {
    switch (type) {
        case 'buttons':
            return CreateButtons(data, label);
            break;
        case 'radiobutton':
            return CreateRadioButtons(data, label);
            break;
        case 'list':
            return CreateList(data, label);
            break;
    }
}

// "button" actually represents checkboxes.
function CreateButtons(data, label) {
    let list = document.createElement('div');

    if (label.length > 0) {
        let title = document.createElement('span');
        title.innerHTML = label;
        list.appendChild(title);
    }

    // Create the checkboxes
    data.forEach((item) => {
        let option = document.createElement('div');
        option.classList.add('form-check', 'form-check-inline');

        // Create a unique id for label purposes
        let id = makeid(5);

        // Checkbox
        let box = document.createElement('input');
        box.classList.add('form-check-input');
        box.setAttribute("type", "checkbox");
        box.value = item.value;
        box.id = id;
        option.appendChild(box);

        // Label
        let elementLabel = document.createElement('label');
        elementLabel.classList.add('form-check-label');
        elementLabel.htmlFor = id;
        elementLabel.innerHTML = item.label;
        option.appendChild(elementLabel);

        list.appendChild(option);
    });

    return list;
}

function CreateRadioButtons(data, label) {
    let list = document.createElement('div');

    if (label.length > 0) {
        let title = document.createElement('span');
        title.innerHTML = label;
        list.appendChild(title);
    }

    // Create a shared name so the radio buttons are associated with each other.
    let radioName = makeid(5);

    // Create the radio buttons
    data.forEach((item) => {
        let option = document.createElement('div');
        option.classList.add('form-check', 'form-check-inline');

        // Create a unique id for label purposes
        let id = makeid(5);

        // Checkbox
        let radio = document.createElement('input');
        radio.classList.add('form-check-input');
        radio.setAttribute("type", "radio");
        radio.value = item.value;
        radio.id = id;
        radio.name = radioName;
        option.appendChild(radio);

        // Label
        let elementLabel = document.createElement('label');
        elementLabel.classList.add('form-check-label');
        elementLabel.htmlFor = id;
        elementLabel.innerHTML = item.label;
        option.appendChild(elementLabel);

        list.appendChild(option);
    });

    return list;
}

function CreateList(data, label) {
    let list = document.createElement('div');
    list.classList.add('col-auto');

    // Create a unique id
    let id = makeid(5);

    if (label.length > 0) {
        let title = document.createElement('span');
        title.innerHTML = label;
        list.appendChild(title);
    }

    // Create the dropdown
    let select = document.createElement('select');
    select.id = id;
    list.appendChild(select);

    // Add the dropdown options
    data.forEach((item) => {
        let option = document.createElement('option');
        option.value = item.value;
        option.text = item.label;
        select.appendChild(option);
    });

    return list;
}

function CalculateRng() {
    let rngTotal = 0;
    // Get all values from select boxes
    const listmatches = document.querySelectorAll("option:checked").forEach((option) => {
        rngTotal += parseInt(option.value);
    });

    // Get all values from checkboxes
    const checkmatches = document.querySelectorAll("input:checked").forEach((option) => {
        rngTotal += parseInt(option.value);
    });

    // Get all values from radio buttons

    console.log(baseRng + rngTotal);
}

// Helper functions
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

document.getElementById('go').addEventListener('click', CalculateRng);