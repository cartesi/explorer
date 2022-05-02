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
    Text,
    Box,
    InputGroup,
    Input,
    InputRightElement,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { CommonStepProps } from './interfaces';

const { ACTIVE, NOT_ACTIVE, COMPLETED } = StepStatus;

const HireNode = ({
    stepNumber,
    onComplete,
    onPrevious,
    onStepActive,
    inFocus,
}: CommonStepProps) => {
    // temporary value. It will be dynamic
    const ethBalance = 126.23;
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
            title="Hire Node"
            subtitle="At this point, stake your funds using Cartesi Explorer."
            stepNumber={stepNumber}
            status={state.status}
            onActive={onStepActive}
        >
            <StepBody>
                <FormControl pr={{ base: 0, md: '20vw' }} mb={6} mt={4}>
                    <FormLabel htmlFor="node_address" fontWeight="medium">
                        Node Address
                    </FormLabel>
                    <InputGroup>
                        <Input id="node_address" type="text" size="lg" />
                    </InputGroup>
                    <FormHelperText fontSize={14}>
                        You may find from the docker configuration
                    </FormHelperText>
                    <FormErrorMessage></FormErrorMessage>
                </FormControl>
                <FormControl pr={{ base: 0, md: '20vw' }}>
                    <FormLabel htmlFor="initial_funds" fontWeight="medium">
                        Initial Funds
                    </FormLabel>
                    <InputGroup>
                        <Input id="initial_funds" type="number" size="lg" />
                        <InputRightElement
                            children="ETH"
                            m={1}
                            mr={2}
                            color="gray"
                            fontSize={12}
                        />
                    </InputGroup>
                    <FormHelperText color="gray" fontSize={14}>
                        Your balance: {ethBalance} ETH
                    </FormHelperText>
                    <FormErrorMessage></FormErrorMessage>
                </FormControl>
                <Box px={6} py={4} bgColor="gray.80" mt={6}>
                    <Text>
                        You need to specify the amount of ETH you want to give
                        to your node. The node holds a separate Ethereum account
                        and key pair, and only spends your ETH to accept being
                        hired during setup (only once) and then to produce
                        blocks. That means you only incur transaction fee
                        expenses when you are rewarded with CTSI.
                    </Text>
                </Box>
            </StepBody>
            <StepActions>
                <Stack
                    direction={{ base: 'row' }}
                    justifyContent={{ base: 'space-between', md: 'flex-start' }}
                >
                    <Button
                        variant="ghost"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(e) => {
                            setState((state) => ({
                                ...state,
                                status: NOT_ACTIVE,
                            }));
                            onPrevious(e);
                        }}
                    >
                        PREVIOUS
                    </Button>
                    <Button
                        colorScheme="blue"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(e) => {
                            setState((state) => ({
                                ...state,
                                status: COMPLETED,
                            }));
                            onComplete(e);
                        }}
                    >
                        NEXT
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default HireNode;
