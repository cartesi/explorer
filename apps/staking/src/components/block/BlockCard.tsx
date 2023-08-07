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
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const borderColor = useColorModeValue('gray.900', 'dark.gray.quaternary');
    const boxShadow = useColorModeValue('md', 'none');

    return (
        <HStack
            shadow={boxShadow}
            p={4}
            bg={bg}
            borderLeftWidth={16}
            borderLeftColor={borderColor}
            align="flex-start"
            borderRadius="1rem"
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
                data-testid="block-image"
            />
        </HStack>
    );
};

export default BlockCard;
