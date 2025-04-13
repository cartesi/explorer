// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Button, Table, Text } from '@chakra-ui/react';
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

    return (
        <Table.Root variant="clear" size="sm" data-testid="block-table">
            <Table.Body>
                <Table.Row bg={highlight === 'id' && highlightColor}>
                    <Table.Cell>Block {highlight}</Table.Cell>
                    <Table.Cell>
                        <Text>{block.number}</Text>
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Chain</Table.Cell>
                    <Table.Cell>{block.chain.number}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Protocol</Table.Cell>
                    <Table.Cell>{block.chain.protocol.version}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Date</Table.Cell>
                    <Table.Cell>
                        {new Date(block.timestamp * 1000).toUTCString()}
                    </Table.Cell>
                </Table.Row>
                <Table.Row bg={highlight === 'producer' && highlightColor}>
                    <Table.Cell>Producer</Table.Cell>
                    <Table.Cell>
                        <Address
                            address={block.producer.id}
                            chainId={chainId}
                            responsive
                            color={addressColor}
                        />
                    </Table.Cell>
                </Table.Row>
                <Table.Row bg={highlight === 'node' && highlightColor}>
                    <Table.Cell>Node</Table.Cell>
                    <Table.Cell>
                        <Address
                            address={block.node.id}
                            chainId={chainId}
                            responsive
                            color={addressColor}
                        />
                    </Table.Cell>
                </Table.Row>
                <Table.Cell>
                    <Table.Row>Hash</Table.Row>
                    <Table.Row>
                        <Address
                            type="tx"
                            address={block.id}
                            chainId={chainId}
                            truncated
                            color={addressColor}
                        />
                    </Table.Row>
                </Table.Cell>
                <Table.Row>
                    <Table.Cell>Reward</Table.Cell>
                    <Table.Cell>{formatCTSI(block.reward, 18)} CTSI</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table.Root>
    );
};

export default BlockTable;
