// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Table, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useColorModeValue } from '../ui/color-mode';

import { Block } from '../../graphql/models';
import { formatCTSI } from '../../utils/token';
import Address from '../Address';

export type BlockHighlightProp = 'id' | 'node' | 'producer';

interface BlockTableProps {
    chainId: number;
    block: Block;
    highlight?: BlockHighlightProp;
    highlightColor: string;
}

const BlockTable: FC<BlockTableProps> = (props) => {
    const { chainId, block, highlight, highlightColor = 'lightyellow' } = props;
    const addressColor = useColorModeValue('gray.800', 'white');
    const tableCellProps = {
        textTransform: 'uppercase',
        fontSize: 'xs',
        fontWeight: 'bold',
    };

    return (
        <Table.Root variant="clear" size="sm" data-testid="block-table">
            <Table.Body>
                <Table.Row bg={highlight === 'id' && highlightColor}>
                    <Table.Cell {...tableCellProps}>
                        Block {highlight}
                    </Table.Cell>
                    <Table.Cell fontSize="sm">
                        <Text>{block.number}</Text>
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell {...tableCellProps}>Chain</Table.Cell>
                    <Table.Cell fontSize="sm">{block.chain.number}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell {...tableCellProps}>Protocol</Table.Cell>
                    <Table.Cell fontSize="sm">
                        {block.chain.protocol.version}
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell {...tableCellProps}>Date</Table.Cell>
                    <Table.Cell fontSize="sm">
                        {new Date(block.timestamp * 1000).toUTCString()}
                    </Table.Cell>
                </Table.Row>
                <Table.Row bg={highlight === 'producer' && highlightColor}>
                    <Table.Cell {...tableCellProps}>Producer</Table.Cell>
                    <Table.Cell>
                        <Address
                            address={block.producer.id}
                            chainId={chainId}
                            responsive
                            color={addressColor}
                            fontSize="sm"
                        />
                    </Table.Cell>
                </Table.Row>
                <Table.Row bg={highlight === 'node' && highlightColor}>
                    <Table.Cell {...tableCellProps}>Node</Table.Cell>
                    <Table.Cell>
                        <Address
                            address={block.node.id}
                            chainId={chainId}
                            responsive
                            color={addressColor}
                            fontSize="sm"
                        />
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell {...tableCellProps}>Hash</Table.Cell>
                    <Table.Cell>
                        <Address
                            type="tx"
                            address={block.id}
                            chainId={chainId}
                            truncated
                            color={addressColor}
                            fontSize="sm"
                        />
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell {...tableCellProps}>Reward</Table.Cell>
                    <Table.Cell fontSize="sm">
                        {formatCTSI(block.reward, 18)} CTSI
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table.Root>
    );
};

export default BlockTable;
