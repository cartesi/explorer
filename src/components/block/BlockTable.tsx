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
    Table,
    TableProps,
    Tbody,
    Td,
    Text,
    Th,
    Tr,
    useColorModeValue,
} from '@chakra-ui/react';

import Address from '../Address';
import { Block } from '../../graphql/models';
import { formatCTSI } from '../../utils/token';

export type BlockHighlightProp = 'id' | 'node' | 'producer';

interface BlockTableProps extends TableProps {
    chainId: number;
    block: Block;
    highlight?: BlockHighlightProp;
    highlightColor: string;
}

const BlockTable: FC<BlockTableProps> = (props) => {
    const {
        chainId,
        block,
        highlight,
        highlightColor = 'lightyellow',
        ...tableProps
    } = props;
    const addressColor = useColorModeValue('gray.800', 'white');

    return (
        <Table {...tableProps} variant="clear" size="sm">
            <Tbody>
                <Tr bg={highlight === 'id' && highlightColor}>
                    <Th>Block {highlight}</Th>
                    <Td>
                        <Text>{block.number}</Text>
                    </Td>
                </Tr>
                <Tr>
                    <Th>Chain</Th>
                    <Td>{block.chain.number}</Td>
                </Tr>
                <Tr>
                    <Th>Protocol</Th>
                    <Td>{block.chain.protocol.version}</Td>
                </Tr>
                <Tr>
                    <Th>Date</Th>
                    <Td>{new Date(block.timestamp * 1000).toUTCString()}</Td>
                </Tr>
                <Tr bg={highlight === 'producer' && highlightColor}>
                    <Th>Producer</Th>
                    <Td>
                        <Address
                            address={block.producer.id}
                            chainId={chainId}
                            responsive
                            color={addressColor}
                        />
                    </Td>
                </Tr>
                <Tr bg={highlight === 'node' && highlightColor}>
                    <Th>Node</Th>
                    <Td>
                        <Address
                            address={block.node.id}
                            chainId={chainId}
                            responsive
                            color={addressColor}
                        />
                    </Td>
                </Tr>
                <Tr>
                    <Th>Hash</Th>
                    <Td>
                        <Address
                            type="tx"
                            address={block.id}
                            chainId={chainId}
                            truncated
                            color={addressColor}
                        />
                    </Td>
                </Tr>
                <Tr>
                    <Th>Reward</Th>
                    <Td>{formatCTSI(block.reward, 18)} CTSI</Td>
                </Tr>
            </Tbody>
        </Table>
    );
};

export default BlockTable;
