// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { NodeInfoSection } from '../../../src/components/node/NodeInfoSection';
import { BigNumber } from 'ethers';

const TEST_ADDRESS = '0xb00299b573a9deee20e6a242416188d1033e325f';
const TEST_USER_BALANCE = BigNumber.from('0x029799b68c5fbbd4');
const TEST_NODE_BALANCE = BigNumber.from('0x029799b68c5fbbd4');
const NODE_BALANCE_ETH = '0.1868';

describe('NodeInfoSection component', () => {
    afterEach(() => cleanup());

    it('Should render proper values', () => {
        render(
            <NodeInfoSection
                address={TEST_ADDRESS}
                userBalance={TEST_USER_BALANCE}
                nodeBalance={TEST_NODE_BALANCE}
                onRetire={null}
                onDeposit={null}
                onHire={null}
            />
        );

        expect(screen.getByText(TEST_ADDRESS)).toBeInTheDocument();
        expect(screen.getByText(NODE_BALANCE_ETH)).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Hired')).toBeInTheDocument();
    });
});
