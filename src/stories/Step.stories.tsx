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
} from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import { Step, StepActions, StepBody, StepStatus } from '../components/Step';

export default {
    title: 'Step',
    component: Step,
    argTypes: {},
} as Meta<typeof Step>;

type Story = StoryObj<typeof Step>;

const Template: Story = {
    render: (args) => {
        return (
            <Stack
                bg="gray.80"
                spacing={8}
                px={{ base: '3vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 8, sm: 'yvw' }}
                direction="column"
                alignItems="stretch"
            >
                <Step {...args}>
                    <StepActions>
                        <Button colorScheme="blue">NEXT</Button>
                    </StepActions>
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
                            You can customize your Ethereum node by a
                            third-party, and you have to register with the
                            third-party software before next step.
                        </Text>

                        <Heading as="h3" size="sm" my={4}>
                            Ethereum Gateway
                        </Heading>
                        <Flex
                            alignItems="baseline"
                            p={6}
                            border="solid 1px var(--chakra-colors-gray-200)"
                        >
                            <Flex direction="column">
                                <Box>
                                    <Link
                                        href="https://infura.io/"
                                        target="_blank"
                                        color="teal.light"
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
                                        color="teal.light"
                                        fontWeight="medium"
                                        textDecorationLine="underline"
                                        fontSize="md"
                                    >
                                        2. Alchemy
                                    </Link>
                                </Box>
                                <Text fontSize="sm" fontWeight="normal">
                                    (The recommended third party)
                                </Text>
                            </Flex>
                            <UnorderedList ml={12}>
                                <ListItem>Relatively stable.</ListItem>
                                <ListItem>
                                    Have to register and setup in advance
                                </ListItem>
                            </UnorderedList>
                        </Flex>
                    </StepBody>
                </Step>
            </Stack>
        );
    },
};

export const Optional: Story = {
    args: {
        stepNumber: 1,
        title: 'Pool ENS',
        subtitle: 'Registering a ENS domain and setting it up.',
        status: StepStatus.ACTIVE,
        optionalText: 'This step could be skipped.',
    },
    ...Template,
};

export const Active: Story = {
    args: {
        stepNumber: 1,
        title: 'Customizing your Ethereum Node',
        subtitle: 'There are a few steps to prepare for your setting',
        status: StepStatus.ACTIVE,
    },
    ...Template,
};

export const Complete: Story = {
    args: {
        stepNumber: 1,
        title: 'Customizing your Ethereum Node',
        subtitle: 'There are a few steps to prepare for your setting',
        status: StepStatus.COMPLETED,
    },
    ...Template,
};

export const Inactive: Story = {
    args: {
        stepNumber: 1,
        title: 'Customizing your Ethereum Node',
        subtitle: 'There are a few steps to prepare for your setting',
        status: StepStatus.NOT_ACTIVE,
    },
    ...Template,
};
