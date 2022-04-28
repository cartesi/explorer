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
} from '@chakra-ui/react';
import { Step, StepActions, StepBody, StepProps } from '../../Step';

type Props = Pick<StepProps, 'stepNumber' | 'status'>;

const CustomizeEthereumNode = ({ stepNumber, status }: Props) => (
    <Step
        title="Customizing your Ethereum Node"
        subtitle="There are a few steps to prepare for your setting"
        stepNumber={stepNumber}
        status={status}
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
                You can customize your Ethereum node by a third-party, and you
                have to register with the third-party software before next step.
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
                        (The recommended third party)
                    </Text>
                </Flex>
                <UnorderedList ml={12}>
                    <ListItem>Relatively stable.</ListItem>
                    <ListItem>Have to register and setup in advance</ListItem>
                </UnorderedList>
            </Flex>
        </StepBody>
        <StepActions>
            <Button colorScheme="blue">NEXT</Button>
        </StepActions>
    </Step>
);

CustomizeEthereumNode.displayName = 'Step';
CustomizeEthereumNode.name = 'Step';

export default CustomizeEthereumNode;
