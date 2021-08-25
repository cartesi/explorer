// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, useState, useMemo } from 'react';
import {
    Box,
    BoxProps,
    Tabs as CharkaTabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import theme from '../../styles/theme';

interface TabsProps extends BoxProps {
    Stake: React.ReactNode;
    Unstake: React.ReactNode;
}

export const Tabs: FC<TabsProps> = (props) => {
    const { Stake, Unstake, ...restProps } = props;
    const [tabIndex, setTabIndex] = useState(0);
    const tabs = useMemo(
        () => [
            {
                name: 'stake',
                label: 'Stake',
            },
            {
                name: 'unstake',
                label: 'Unstake',
            },
        ],
        []
    );

    return (
        <Box {...restProps}>
            <CharkaTabs
                variant="unstyled"
                index={tabIndex}
                isFitted
                onChange={setTabIndex}
            >
                <TabList>
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab.name}
                            py={4}
                            color="white"
                            bg={
                                tabIndex === index
                                    ? 'black'
                                    : theme.colors.secondary
                            }
                            _selected={{
                                color: 'white',
                                borderBottomWidth: 5,
                                borderBottomColor: theme.colors.info,
                                boxShadow: theme.boxShadows.sm,
                            }}
                            _hover={{
                                opacity: 0.9,
                                boxShadow: 'none',
                            }}
                        >
                            {tab.label}
                        </Tab>
                    ))}
                </TabList>

                <TabPanels boxShadow="md" padding="35px 4.5vw">
                    <TabPanel p={0}>{Stake}</TabPanel>
                    <TabPanel p={0}>{Unstake}</TabPanel>
                </TabPanels>
            </CharkaTabs>
        </Box>
    );
};

export default Tabs;
