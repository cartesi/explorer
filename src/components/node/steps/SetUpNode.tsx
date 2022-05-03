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
    Flex,
    Box,
    useClipboard,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { CommonStepProps } from './interfaces';

const { ACTIVE, NOT_ACTIVE, COMPLETED } = StepStatus;

const CopyBoard = ({ command, children }) => {
    const { hasCopied, onCopy } = useClipboard(command);
    const bgColor = useColorModeValue('gray.80', 'gray.800');
    return (
        <Flex
            p={{ base: 3, md: 6 }}
            bgColor={bgColor}
            rounded="sm"
            mt={3}
            alignItems="center"
            justifyContent={{ base: 'space-between', md: 'flex-start' }}
            wrap="nowrap"
        >
            <Box maxWidth={{ base: '75%', md: '90%' }}>{children}</Box>{' '}
            {!hasCopied && (
                <Box minH={6} alignSelf="flex-start" ml={2}>
                    <Box
                        as={MdContentCopy}
                        onClick={onCopy}
                        fontSize="xl"
                        minW={6}
                    />
                </Box>
            )}
            {hasCopied && (
                <Text fontSize="sm" ml={2} alignSelf="flex-start">
                    Copied
                </Text>
            )}
        </Flex>
    );
};

const SetUpNode = ({
    stepNumber,
    onComplete,
    onPrevious,
    onStepActive,
    inFocus,
}: CommonStepProps) => {
    const dockerPullTxt = 'docker pull cartesi/noether';
    const dockerRunTxt = (
        <>
            docker run -it --rm --name cartesi_noether -v
            cartesi_wallet:/root/.ethereum cartesi/noether --url{' '}
            <Text as="span" color="blue.300">
                &lt;https://mainnet.infura.io/v3/project_id&gt;
            </Text>{' '}
            --wallet /root/.ethereum/key --create --verbose;
        </>
    );

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
            title="Set up Node"
            subtitle="There are a few steps to prepare on your computer"
            stepNumber={stepNumber}
            status={state.status}
            onActive={onStepActive}
        >
            <StepBody>
                <Heading as="h3" size="sm" my={4}>
                    Run Cartesi's node
                </Heading>
                <UnorderedList pl={2}>
                    <ListItem>
                        <Text>
                            Open a terminal and run the following command lines.
                        </Text>
                    </ListItem>
                </UnorderedList>

                <CopyBoard command={dockerPullTxt}>{dockerPullTxt}</CopyBoard>

                <Heading as="h3" size="sm" my={4}>
                    Run your customizing node gateway
                </Heading>
                <Text>
                    Any Ethereum node can be used by replacing that by a local
                    `geth` URL or another service provided by a third-party,
                    like Infura or Alchemy.
                </Text>
                <Text mt={3}>
                    For example, if in the case of using a remote <b>Infura</b>{' '}
                    node you will run:
                </Text>
                <CopyBoard
                    command={
                        'docker run -it --rm --name cartesi_noether -v cartesi_wallet:/root/.ethereum cartesi/noether --url <https://mainnet.infura.io/v3/project_id> --wallet /root/.ethereum/key --create --verbose;'
                    }
                >
                    {dockerRunTxt}
                </CopyBoard>

                <UnorderedList pl={2}>
                    <ListItem>
                        <Heading as="h3" size="sm" my={4} mb={2}>
                            Where &lt;URL&gt; must be replaced by your
                            third-party's URL.
                        </Heading>
                        <Text>
                            The worker node will create a new Ethereum wallet,
                            asking for an encryption password.
                        </Text>
                    </ListItem>
                </UnorderedList>
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

export default SetUpNode;
