// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { Table, TableProps, Tbody, Td, Th, Tr } from '@chakra-ui/react';

import Address from '../Address';
import { Block } from '../../graphql/models';
import { formatCTSI } from '../../utils/token';

interface BlockTableProps extends TableProps {
    block: Block;
}

const BlockTable: FunctionComponent<BlockTableProps> = (props) => {
    const { block, ...tableProps } = props;
    return (
        <Table {...tableProps} variant="clear" size="sm">
            <Tbody>
                <Tr>
                    <Th>Block</Th>
                    <Td>{block.number}</Td>
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
                <Tr>
                    <Th>Producer</Th>
                    <Td>
                        <Address address={block.producer.id} responsive />
                    </Td>
                </Tr>
                <Tr>
                    <Th>Node</Th>
                    <Td>
                        <Address address={block.node.id} responsive />
                    </Td>
                </Tr>
                <Tr>
                    <Th>Hash</Th>
                    <Td>
                        <Address type="tx" address={block.id} truncated />
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
