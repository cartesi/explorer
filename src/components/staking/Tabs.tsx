import React, { useState, useMemo } from 'react';
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

export const Tabs: React.FunctionComponent<TabsProps> = (props) => {
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
                tabIndex={tabIndex}
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

                <TabPanels boxShadow={theme.boxShadows.md} padding="35px 4.5vw">
                    <TabPanel>{Stake}</TabPanel>
                    <TabPanel>{Unstake}</TabPanel>
                </TabPanels>
            </CharkaTabs>
        </Box>
    );
};

export default Tabs;
