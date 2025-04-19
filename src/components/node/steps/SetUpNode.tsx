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
    List,
    Stack,
    Text,
    useClipboard,
} from '@chakra-ui/react';
import { MdContentCopy } from 'react-icons/md';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import { useColorModeValue } from '../../ui/color-mode';

const { COMPLETED } = StepStatus;

const CopyBoard = ({ command, children }) => {
    const { copied, copy } = useClipboard(command);
    const bgColor = useColorModeValue('teal.light', 'dark.gray.tertiary');
    return (
        <Flex
            p={{ base: 3, md: 6 }}
            bgColor={bgColor}
            rounded="md"
            mt={3}
            alignItems="center"
            justifyContent={{ base: 'space-between', md: 'flex-start' }}
            wrap="nowrap"
        >
            <Box maxWidth={{ base: '75%', md: '90%' }}>{children}</Box>{' '}
            {!copied && (
                <Box minH={6} alignSelf="flex-start" ml={2}>
                    <Box
                        as={MdContentCopy}
                        cursor={'pointer'}
                        onClick={copy}
                        fontSize="xl"
                        minW={6}
                    />
                </Box>
            )}
            {copied && (
                <Text fontSize="sm" ml={2} alignSelf="flex-start">
                    Copied
                </Text>
            )}
        </Flex>
    );
};

const SetUpNode = ({
    stepNumber,
    currentStep,
    onComplete,
    onPrevious,
    onStepActive,
    inFocus,
}: IStep) => {
    const dockerPullTxt = 'docker pull cartesi/noether';
    const linkColor = useColorModeValue('teal.secondary', 'cyan.primary');
    const dockerRunTxt = (
        <>
            docker run -it --rm --name cartesi_noether -v
            cartesi_wallet:/root/.ethereum cartesi/noether --url{' '}
            <Text as="span" color={linkColor}>
                &lt;https://mainnet.infura.io/v3/project_id&gt;
            </Text>{' '}
            --wallet /root/.ethereum/key --create --verbose;
        </>
    );

    const [state, setState] = useStepState({ inFocus });
    const bg = useColorModeValue('white', 'dark.background.secondary');
    const borderColor = useColorModeValue(
        'light.grey.tertiary',
        'dark.border.quaternary'
    );
    const buttonColorScheme = useColorModeValue('teal', 'cyan');
    const isHighlighted =
        stepNumber - 1 === currentStep || stepNumber <= currentStep;

    return (
        <Step
            title="Set up Node"
            subtitle="There are a few steps to prepare on your computer"
            stepNumber={stepNumber}
            status={state.status}
            onActive={onStepActive}
            bg={isHighlighted ? bg : undefined}
            borderRadius={'md'}
            borderWidth={isHighlighted ? '1px' : 0}
            borderColor={borderColor}
            borderStyle={'solid'}
        >
            <StepBody>
                <Heading as="h3" size="sm" my={4}>
                    Start By installing Docker Enginer
                </Heading>
                <List.Root pl={2}>
                    <List.Item _marker={{ color: 'inherit' }} ml={4}>
                        <Link
                            color={linkColor}
                            href="https://docs.docker.com/desktop/mac/install/"
                            target="_blank"
                            _hover={{
                                opacity: 0.9,
                            }}
                        >
                            Download for Mac (macOS)
                        </Link>
                    </List.Item>
                    <List.Item _marker={{ color: 'inherit' }} ml={4}>
                        <Link
                            color={linkColor}
                            href="https://docs.docker.com/desktop/windows/install/"
                            target="_blank"
                            _hover={{
                                opacity: 0.9,
                            }}
                        >
                            Download for Windows
                        </Link>
                    </List.Item>
                </List.Root>
                <Heading as="h3" size="sm" my={4}>
                    Run Cartesi's node
                </Heading>
                <List.Root pl={2}>
                    <List.Item _marker={{ color: 'inherit' }} ml={4}>
                        <Text>
                            Open a terminal and run the following command lines.
                        </Text>
                    </List.Item>
                </List.Root>

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

                <List.Root pl={2}>
                    <List.Item _marker={{ color: 'inherit' }} ml={4}>
                        <Heading as="h3" size="sm" my={4} mb={2}>
                            Where &lt;URL&gt; must be replaced by your
                            third-party's URL.
                        </Heading>
                        <Text>
                            The worker node will create a new Ethereum wallet,
                            asking for an encryption password.
                        </Text>
                    </List.Item>
                </List.Root>
            </StepBody>
            <StepActions>
                <Stack
                    direction={{ base: 'row' }}
                    justifyContent={{ base: 'space-between', md: 'flex-start' }}
                >
                    <Button
                        colorScheme="darkGray"
                        variant="ghost"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(e) => {
                            onPrevious(e);
                        }}
                    >
                        PREVIOUS
                    </Button>
                    <Button
                        colorScheme={buttonColorScheme}
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(e) => {
                            setState(COMPLETED);
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
