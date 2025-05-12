// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    BoxProps,
    Center,
    Flex,
    HStack,
    Icon,
    Image,
    Spacer,
    Text,
} from '@chakra-ui/react';
import { IoMdTime } from 'react-icons/io';
import humanizeDuration from 'humanize-duration';
import { FunctionComponent } from 'react';
import { useColorModeValue } from '../ui/color-mode';

import { Block } from '../../graphql/models';
import { tinyGraphUrl } from '../../utils/tinygraph';
import Address from '../Address';

export interface BlockMiniCardProps extends BoxProps {
    chainId: number;
    block: Block;
    showProtocol?: boolean;
    showChain?: boolean;
}

const BlockMiniCard: FunctionComponent<BlockMiniCardProps> = (props) => {
    const {
        chainId,
        block,
        showProtocol = true,
        showChain = true,
        ...boxProps
    } = props;
    let id = `${block.number}`;
    if (showChain) {
        id = `${block.chain.number}-${id}`;
    }
    if (showProtocol) {
        id = `${block.chain.protocol.version}-${id}`;
    }

    // dark mode support
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const borderColor = useColorModeValue(
        'dark.border.tertiary',
        'dark.gray.quaternary'
    );

    return (
        <Box {...boxProps}>
            <Center p={2}>
                <HStack>
                    <Icon as={IoMdTime} w={5} h={5} />
                    <Text>
                        {humanizeDuration(Date.now() - block.timestamp * 1000, {
                            units: ['m'],
                            round: true,
                        })}{' '}
                        ago
                    </Text>
                </HStack>
            </Center>
            <Center
                bg="dark.gray.primary"
                p={2}
                borderColor={borderColor}
                borderWidth="1px"
                borderBottom="none"
                borderTopLeftRadius="1rem"
                borderTopRightRadius="1rem"
            >
                <Text color="white">Block {id}</Text>
            </Center>
            <Flex
                p={6}
                justify="space-between"
                bg={bg}
                borderColor={borderColor}
                borderWidth="1px"
                borderTop="none"
                borderBottomLeftRadius="1rem"
                borderBottomRightRadius="1rem"
            >
                <Flex
                    direction="column"
                    align="flex-start"
                    justify="space-around"
                >
                    <Box mb={4}>
                        <Text fontSize="sm">Claimer</Text>
                        <Address
                            address={block.producer.id}
                            chainId={chainId}
                            truncated
                            fontSize="lg"
                        />
                    </Box>
                    <Box>
                        <Text fontSize="sm">Node</Text>
                        <Address
                            address={block.node.id}
                            chainId={chainId}
                            truncated
                            fontSize="sm"
                        />
                    </Box>
                </Flex>
                <Spacer minW={5} />
                <Box marginLeft="auto" flex="0 1 100px">
                    <Image
                        src={tinyGraphUrl(block, 0)}
                        maxWidth="100%"
                        width={100}
                        height={100}
                        alt="Block image"
                        data-testid="block-image"
                    />
                </Box>
            </Flex>
        </Box>
    );
};

export default BlockMiniCard;
