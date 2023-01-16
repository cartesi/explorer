// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import {
    HStack,
    StackProps,
    Image,
    Box,
    useColorModeValue,
} from '@chakra-ui/react';
import { Block } from '../../graphql/models';
import BlockTable, { BlockHighlightProp } from './BlockTable';
import { tinyGraphUrl } from '../../utils/tinygraph';

export interface BlockCardProps extends StackProps {
    chainId: number;
    block: Block;
    highlight?: BlockHighlightProp;
    highlightColor?: string;
}

const BlockCard: FC<BlockCardProps> = (props) => {
    const { chainId, block, highlight, highlightColor, ...stackProps } = props;
    const bg = useColorModeValue('white', 'gray.700');
    return (
        <HStack
            shadow="md"
            p={4}
            bg={bg}
            borderLeftWidth={10}
            borderLeftColor="gray.900"
            align="flex-start"
            {...stackProps}
        >
            <Box w="100%">
                <BlockTable
                    chainId={chainId}
                    block={block}
                    highlight={highlight}
                    highlightColor={highlightColor}
                />
            </Box>
            <Image
                src={tinyGraphUrl(block)}
                alt="Block image"
                boxSize={['0', '50px', '120px', '160px']}
            />
        </HStack>
    );
};

export default BlockCard;
