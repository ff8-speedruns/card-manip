import { Group, Text, useMantineTheme, rem, Tabs, Title, Checkbox, Radio, Select } from '@mantine/core';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';


const CalculateBaseValues = (configData) => {
    // Calculate base values
    let basevalues = {
        q: 0,
        z: 0
    }

    for (let config of configData) {
        let isQuistis = config.button;
        if (config.baseValue != -1) {
            basevalues[isQuistis ? 'q' : 'z'] += config.baseValue;
        }
    }

    return basevalues;
}

const makeid = (length) => {
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


const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);

export function RngCalculator(props) {
    const configData = props.data;
    let bases = CalculateBaseValues(configData);

    const [qRngValue, setQRngValue] = useState({ 'q-basevalue': bases.q });
    const [zRngValue, setZRngValue] = useState({ 'z-basevalue': bases.z });

    const setRngValue = (rngName, val, isQuistis) => {
        if (isQuistis) {
            setQRngValue(prevState => ({ ...prevState, [rngName]: val }));
        } else {
            setZRngValue(prevState => ({ ...prevState, [rngName]: val }));
        }
        console.log(val);
    }

    const CreateButtons = (data, label, catLabel, isQuistis) => {
        let rngName = btoa(`${catLabel}-${label}`)

        return (
            <Checkbox.Group
                label={label}
                onChange={(val) => setRngValue(rngName, val.reduce((a, c) => { return a + parseInt(c) }, 0), isQuistis)}
            >
                <Group mt="xs">
                    {data.map((button) => {
                        return (<Checkbox key={makeid(5)} label={button.label.toString()} value={button.value.toString()} />)
                    })}
                </Group>
            </Checkbox.Group>
        );
    }

    const CreateRadioButtons = (data, label, catLabel, isQuistis) => {
        let rngName = btoa(`${catLabel}-${label}`)
        return (
            <Radio.Group
                label={label}
                onChange={(val) => setRngValue(rngName, parseInt(val), isQuistis)}
            >
                <Group mt="xs">
                    {data.map((button) => {
                        return (<Radio key={makeid(5)} label={button.label.toString()} value={button.value.toString()} />)
                    })}
                </Group>
            </Radio.Group>
        );
    }

    const ProcessCategory = (category, topLabel, isQuistis) => {
        return (
            <>
                <Title order={2} my="md">{category.label}</Title>
                {Object.prototype.hasOwnProperty.call(category, 'subCategories') ? category.subCategories.map((subcategory) => ProcessSubCategory(subcategory, category.baseCountPage || "", category.label, topLabel, isQuistis)) : ""}
            </>
        )
    }

    const ProcessSubCategory = (subcategory, baseCountPage, catLabel, topLabel, isQuistis) => {
        let label = subcategory.label || "";

        catLabel = `${topLabel}-${catLabel}`;

        switch (subcategory.type.toLowerCase()) {
            case 'buttons':
                return CreateButtons(subcategory.value, label, catLabel, isQuistis);
            case 'radiobutton':
                return CreateRadioButtons(subcategory.value, label, catLabel, isQuistis);
            case 'list':
                return CreateList(subcategory.value, label, catLabel, subcategory.times || 1, isQuistis);
        }
    }

    const CreateList = (data, label, catLabel, times, isQuistis) => {
        let rngName = btoa(`${catLabel}-${label}`)
        let elements = [];
        for (let i = 1; i <= times; i++) {
            let rngNameTimes = `${rngName}-${i}`;
            elements.push(<Select
                key={rngNameTimes}
                label={label}
                placeholder="Pick one"
                data={data}
                onChange={(val) => setRngValue(rngNameTimes, val, isQuistis)}
            />)
        }
        return (<Group mt="xs">{elements}</Group>);
    }
    //! Start the actual computation.

    // Iterate through top level categories (tabs)
    const tablist = configData.map((config) => {
        // if button == true: quistis
        // if button == false: zell
        return (<Tabs.Tab key={config.label} value={config.label} icon={<IconPhoto size="0.8rem" />}>{config.label}</Tabs.Tab>)
    });

    const tabs = configData.map((config) => {
        //console.log(rngValue);
        let isQuistis = config.button;

        return (
            <Tabs.Panel key={config.label} value={config.label} pt="xs">
                {config.categories.map((category) => ProcessCategory(category, config.label, isQuistis))}
            </Tabs.Panel>
        );
    });

    return (
        <Tabs defaultValue="gallery">
            <Tabs.List>
                {tablist}
            </Tabs.List>
            {tabs}
            Q: {sumValues(qRngValue)} <br />
            Z: {sumValues(zRngValue)}
        </Tabs>
    );
}

RngCalculator.propTypes = {
    data: PropTypes.array.isRequired
}