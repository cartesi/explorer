// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import {
    Box,
    BoxProps,
    Center,
    Flex,
    HStack,
    Image,
    Spacer,
    Text,
} from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import humanizeDuration from 'humanize-duration';

import Address from '../Address';
import { Block } from '../../graphql/models';
import { tinyGraphUrl } from '../../utils/tinygraph';

interface BlockMiniCardProps extends BoxProps {
    block: Block;
    showProtocol?: boolean;
    showChain?: boolean;
}

const BlockMiniCard: FunctionComponent<BlockMiniCardProps> = (props) => {
    const { block, showProtocol = true, showChain = true } = props;
    let id = `${block.number}`;
    if (showChain) {
        id = `${block.chain.number}-${id}`;
    }
    if (showProtocol) {
        id = `${block.chain.protocol.version}-${id}`;
    }
    return (
        <Box {...props}>
            <Center p={2}>
                <HStack>
                    <TimeIcon />
                    <Text fontWeight="bold">
                        {humanizeDuration(block.timestamp, { largest: 2 })} ago
                    </Text>
                </HStack>
            </Center>
            <Center bg="black" p={2}>
                <Text color="white">Block {id}</Text>
            </Center>
            <Flex p={10} align="center" justify="space-between" boxShadow="md">
                <Flex
                    direction="column"
                    align="flex-start"
                    justify="space-around"
                >
                    <Box>
                        <Text>Producer</Text>
                        <Address
                            address={block.producer.id}
                            truncated
                            fontWeight="bold"
                            fontSize="large"
                        />
                    </Box>
                    <Spacer minH={5} />
                    <Box>
                        <Text>Node</Text>
                        <Address address={block.node.id} truncated />
                    </Box>
                </Flex>
                <Spacer minW={5} />
                <Image src={tinyGraphUrl(block)} w="120px" h="120px" />
            </Flex>
        </Box>
    );
};

export default BlockMiniCard;
