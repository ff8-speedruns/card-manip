import Siteheader from './Siteheader';
import { AppShell, Header, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

import { FileUpload } from './FileUpload';
import { RngCalculator } from './RngCalculator';


export default function Shell() {
  const [showUpload, setShowUpload] = useState(true);
  const [setupData, setsetupData] = useState(true);

  const handleNewFile = (json) => {
    console.log(json);
    setsetupData(json);
    setShowUpload(false);
  }

  return (
    <AppShell
      padding="md"
      header={<Header height={60} p="xs"><Siteheader /></Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <Alert icon={<IconAlertCircle size="1rem" />} title="Do Not Use" color="red" variant="outline">
        This tool is under construction and does not yet work as intended.
      </Alert>
      {showUpload ? <FileUpload onChange={handleNewFile} /> : ''}
      {!showUpload ? <RngCalculator data={setupData} /> : ''}
    </AppShell>
  );
}

/* 

  const [searchPattern, setSearchPattern] = useState('');
  const handleNewPattern = (pattern) => setSearchPattern(pattern);
      <Searchbar onChange={handleNewPattern} />
      <Pattern data={data} pattern={searchPattern} />
*/