// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { HStack, StackProps, Image } from '@chakra-ui/react';
import { Block } from '../../graphql/models';
import BlockTable, { BlockHighlightProp } from './BlockTable';
import { tinyGraphUrl } from '../../utils/tinygraph';

interface BlockCardProps extends StackProps {
    chainId: number;
    block: Block;
    highlight?: BlockHighlightProp;
    highlightColor?: string;
}

const BlockCard: FunctionComponent<BlockCardProps> = (props) => {
    const { chainId, block, highlight, highlightColor, ...rest } = props;
    return (
        <HStack
            {...rest}
            shadow="md"
            p={4}
            borderLeft="20px solid black"
            align="flex-start"
        >
            <BlockTable
                chainId={chainId}
                block={block}
                highlight={highlight}
                highlightColor={highlightColor}
            />
            <Image
                src={tinyGraphUrl(block)}
                boxSize={['0', '50px', '120px', '160px']}
            />
        </HStack>
    );
};

export default BlockCard;
