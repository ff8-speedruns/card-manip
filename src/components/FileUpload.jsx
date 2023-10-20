import { Group, Text, useMantineTheme, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import { Dropzone } from '@mantine/dropzone';

export function FileUpload(props) {
    const theme = useMantineTheme();

    const onFileUpload = async ([file]) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            let contents = e.target.result;
            let json = JSON.parse(contents);
            props.onChange(json);
        };
        reader.readAsText(file);
    }

    return (
        <Dropzone
            multiple={false}
            onDrop={onFileUpload}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={3 * 1024 ** 2}
            accept={["application/json"]}
            {...props}
        >
            <Group position="center" spacing="xl" style={{ minHeight: rem(220), pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                        size="3.2rem"
                        stroke={1.5}
                        color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        size="3.2rem"
                        stroke={1.5}
                        color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto size="3.2rem" stroke={1.5} />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Drag images here or click to select files
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                        Attach as many files as you like, each file should not exceed 5mb
                    </Text>
                </div>
            </Group>
        </Dropzone>
    );
}

FileUpload.propTypes = {
    onChange: PropTypes.func.isRequired
}