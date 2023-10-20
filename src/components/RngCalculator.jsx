import { Group, Text, useMantineTheme, rem, Tabs, Checkbox, Radio, Select } from '@mantine/core';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';

export function RngCalculator(props) {
    const [rngValue, setRngValue] = useState({});
    const configData = props.data;

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

    const ProcessCategory = (category, topLabel) => {
        return (<>
            <strong>{category.label}</strong><br />
            {Object.prototype.hasOwnProperty.call(category, 'subCategories') ? category.subCategories.map((subcategory) => ProcessSubCategory(subcategory, category.baseCountPage || "", category.label, topLabel)) : ""}
        </>)
    }

    const ProcessSubCategory = (subcategory, baseCountPage, catLabel, topLabel) => {
        let label = subcategory.label || "";

        catLabel = `${topLabel}-${catLabel}`;

        switch (subcategory.type.toLowerCase()) {
            case 'buttons':
                return CreateButtons(subcategory.value, label, catLabel);
            case 'radiobutton':
                return CreateRadioButtons(subcategory.value, label, catLabel);
            case 'list':
                return CreateList(subcategory.value, label, catLabel, subcategory.times || 1);
        }
    }

    const CreateButtons = (data, label, catLabel) => {
        let rngName = `${catLabel}-${label}`

        return (
            <Checkbox.Group
                label={label}
                onChange={(val) => setRngValue(prevState => ({ ...prevState, [rngName]: val.reduce((a, c) => { return a + parseInt(c) }, 0) }))}
            >
                <Group mt="xs">
                    {data.map((button) => {
                        return (<Checkbox key={makeid(5)} label={button.label.toString()} value={button.value.toString()} />)
                    })}
                </Group>
            </Checkbox.Group>
        );
    }

    const CreateRadioButtons = (data, label, catLabel) => {
        let rngName = `${catLabel}-${label}`
        return (
            <Radio.Group
                label={label}
                onChange={(val) => setRngValue(prevState => ({ ...prevState, [rngName]: parseInt(val) }))}
            >
                <Group mt="xs">
                    {data.map((button) => {
                        return (<Radio key={makeid(5)} label={button.label.toString()} value={button.value.toString()} />)
                    })}
                </Group>
            </Radio.Group>
        );
    }

    const CreateList = (data, label, catLabel, times) => {
        let rngName = `${catLabel}-${label}`
        let elements = [];
        for (let i = 1; i < times; i++) {
            let rngNameTimes = `${rngName}-${i}`;
            elements.push(<Select
                key={rngNameTimes}
                label={label}
                placeholder="Pick one"
                data={data}
                onChange={(val) => setRngValue(prevState => ({ ...prevState, [rngNameTimes]: val }))}
            />)
        }
        return (<Group mt="xs">{elements}</Group>);
    }

    const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);

    // Iterate through top level categories (tabs)
    const tablist = configData.map((config) => {
        return (<Tabs.Tab key={config.label} value={config.label} icon={<IconPhoto size="0.8rem" />}>{config.label}</Tabs.Tab>)
    });

    const tabs = configData.map((config) => {
        console.log(rngValue);
        return (
            <Tabs.Panel key={config.label} value={config.label} pt="xs">
                {config.categories.map((category) => ProcessCategory(category, config.label))}
            </Tabs.Panel>
        );
    });

    return (
        <Tabs defaultValue="gallery">
            <Tabs.List>
                {tablist}
            </Tabs.List>
            {tabs}
            {sumValues(rngValue)}
        </Tabs>
    );
}

RngCalculator.propTypes = {
    data: PropTypes.array.isRequired
}