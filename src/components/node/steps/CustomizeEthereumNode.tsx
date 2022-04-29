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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { CommonStepProps } from './interfaces';

const { ACTIVE, NOT_ACTIVE, COMPLETED } = StepStatus;

const CustomizeEthereumNode = ({
    stepNumber,
    inFocus,
    onComplete,
}: CommonStepProps) => {
    const [state, setState] = useState({
        status: inFocus ? ACTIVE : NOT_ACTIVE,
    });

    useEffect(() => {
        if (!inFocus && state.status === COMPLETED) return;

        const status = inFocus ? ACTIVE : NOT_ACTIVE;
        setState((state) => ({ ...state, status }));
    }, [inFocus]);

    return (
        <Step
            title="Customizing your Ethereum Node"
            subtitle="There are a few steps to prepare for your setting"
            stepNumber={stepNumber}
            status={state.status}
        >
            <StepBody>
                <Heading as="h3" size="sm" my={4}>
                    Start By installing Docker Enginer
                </Heading>
                <UnorderedList pl={2}>
                    <ListItem>
                        <Link
                            color="blue.300"
                            href="https://docs.docker.com/desktop/mac/install/"
                            target="_blank"
                        >
                            Download for Mac (macOS)
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            color="blue.300"
                            href="https://docs.docker.com/desktop/windows/install/"
                            target="_blank"
                        >
                            Download for Windows
                        </Link>
                    </ListItem>
                </UnorderedList>
                <Heading as="h3" size="sm" my={4}>
                    Customizing Ethereum node
                </Heading>
                <Text>
                    You can customize your Ethereum node by a third-party, and
                    you have to register with the third-party software before
                    next step.
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
                                color="blue.500"
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
                                color="blue.500"
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
                <Stack direction={{ base: 'column', md: 'row' }}>
                    <Button
                        minWidth={{ base: '100%', md: '10rem' }}
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
