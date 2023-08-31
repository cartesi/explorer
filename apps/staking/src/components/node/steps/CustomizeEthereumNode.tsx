// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    ListItem,
    Stack,
    Text,
    UnorderedList,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';

const { COMPLETED } = StepStatus;

const CustomizeEthereumNode = ({
    stepNumber,
    inFocus,
    onComplete,
    onStepActive,
}: IStep) => {
    const [state, setState] = useStepState({ inFocus });
    const thirdPartyColor = useColorModeValue(
        'light.primary',
        'teal.secondary'
    );
    const bg = useColorModeValue('teal.light', 'rgba(255, 255, 255, 0.06)');
    const borderColor = useColorModeValue(
        'light.grey.tertiary',
        'rgba(255, 255, 255, 0.10)'
    );
    const { colorMode } = useColorMode();
    return (
        <Step
            title="Set up Ethereum Node"
            subtitle="Cartesi node connects to the Ethereum network through a standard gateway"
            stepNumber={stepNumber}
            status={state.status}
            onActive={onStepActive}
            bg={bg}
            borderRadius={'md'}
            borderWidth={'1px'}
            borderColor={borderColor}
            borderStyle={'solid'}
        >
            <StepBody>
                <Heading as="h3" size="sm" my={4}>
                    Ethereum node
                </Heading>
                <Text>
                    The node works with any standard JSON-RPC Ethereum provider.
                    It's important to use a stable and reliable provider.
                </Text>

                <Heading as="h3" size="sm" my={4}>
                    Ethereum Gateway
                </Heading>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    alignItems="baseline"
                    p={{ base: 4, md: 6 }}
                    border="solid 1px var(--chakra-colors-gray-200)"
                >
                    <Flex direction="column">
                        <Box>
                            <Link
                                href="https://infura.io/"
                                target="_blank"
                                color={thirdPartyColor}
                                fontWeight="medium"
                                textDecorationLine="underline"
                                fontSize="md"
                                _hover={{
                                    opacity: 0.8,
                                }}
                            >
                                1. Infura
                            </Link>{' '}
                            or{' '}
                            <Link
                                href="https://www.alchemy.com/"
                                target="_blank"
                                color={thirdPartyColor}
                                fontWeight="medium"
                                textDecorationLine="underline"
                                fontSize="md"
                                _hover={{
                                    opacity: 0.8,
                                }}
                            >
                                2. Alchemy
                            </Link>
                        </Box>
                        <Text fontSize="sm" fontWeight="normal">
                            (Recommended third party)
                        </Text>
                    </Flex>
                    <UnorderedList
                        ml={{ base: 6, md: 12 }}
                        pt={{ base: 4, md: 0 }}
                    >
                        <ListItem>Relatively stable.</ListItem>
                        <ListItem>
                            Have to register and setup in advance
                        </ListItem>
                    </UnorderedList>
                </Flex>
            </StepBody>
            <StepActions>
                <Stack
                    direction={{ base: 'row' }}
                    justifyContent={{ base: 'flex-end', md: 'flex-start' }}
                >
                    <Button
                        minWidth={{ base: '10rem' }}
                        colorScheme={colorMode === 'dark' ? 'cyan' : 'teal'}
                        onClick={(evt) => {
                            setState(COMPLETED);
                            onComplete(evt);
                        }}
                    >
                        NEXT
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default CustomizeEthereumNode;
