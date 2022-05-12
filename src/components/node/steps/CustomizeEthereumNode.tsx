// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    UnorderedList,
    Heading,
    Text,
    ListItem,
    Link,
    Flex,
    Box,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep } from '../../StepGroup';

const { ACTIVE, NOT_ACTIVE, COMPLETED } = StepStatus;

const CustomizeEthereumNode = ({
    stepNumber,
    inFocus,
    onComplete,
    onStepActive,
}: IStep) => {
    const [state, setState] = useState({
        status: inFocus ? ACTIVE : NOT_ACTIVE,
    });
    const thirdPartyColor = useColorModeValue('blue.500', 'blue.200');

    useEffect(() => {
        if (!inFocus && state.status === COMPLETED) return;

        const status = inFocus ? ACTIVE : NOT_ACTIVE;
        setState((state) => ({ ...state, status }));
    }, [inFocus]);

    return (
        <Step
            title="Set up Ethereum Node"
            subtitle="Cartesi node connects to the Ethereum network through a standard gateway"
            stepNumber={stepNumber}
            status={state.status}
            onActive={onStepActive}
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
                        colorScheme="blue"
                        onClick={(evt) => {
                            setState((state) => ({
                                ...state,
                                status: COMPLETED,
                            }));
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
