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
import { BigNumber } from 'ethers';
import { NodeInfoSection } from '../../../src/components/node/NodeInfoSection';

const NODE_BALANCE_ETH = '0.1868';
const defaultProps = {
    address: '0xb00299b573a9deee20e6a242416188d1033e325f',
    userBalance: BigNumber.from('0x029799b68c5fbbd4'),
    nodeBalance: BigNumber.from('0x029799b68c5fbbd4'),
    onRetire: null,
    onHire: null,
    onDeposit: null,
};

describe('NodeInfoSection component', () => {
    afterEach(() => cleanup());

    it('Should render proper values', () => {
        render(<NodeInfoSection {...defaultProps} isOwned />);

        expect(screen.getByText(defaultProps.address)).toBeInTheDocument();
        expect(screen.getByText(NODE_BALANCE_ETH)).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Hired')).toBeInTheDocument();
    });

    it('should render node info section', () => {
        render(<NodeInfoSection {...defaultProps} isOwned />);

        expect(screen.getByText('Node address')).toBeInTheDocument();
    });

    it('should render node hire form', () => {
        render(<NodeInfoSection {...defaultProps} isOwned={false} />);

        expect(screen.getByText('Hire node')).toBeInTheDocument();
    });

    it('should disable edit balance button while retiring', () => {
        render(<NodeInfoSection {...defaultProps} isRetiringNode />);

        const editBalanceButton = screen.getByTestId('edit-balance-button');
        expect(editBalanceButton.hasAttribute('disabled')).toBe(true);
    });

    it('should enable edit balance button when not retiring', () => {
        render(
            <NodeInfoSection {...defaultProps} isOwned isRetiringNode={false} />
        );

        const editBalanceButton = screen.getByTestId('edit-balance-button');
        expect(editBalanceButton.hasAttribute('disabled')).toBe(false);
    });

    it('should disable retire node button while retiring', () => {
        render(<NodeInfoSection {...defaultProps} isRetiringNode />);

        const retireNodeButton = screen
            .getByText('Retire node')
            .closest('button');
        expect(retireNodeButton.hasAttribute('disabled')).toBe(true);
    });

    it('should enable retire node button when not retiring', () => {
        render(
            <NodeInfoSection {...defaultProps} isOwned isRetiringNode={false} />
        );

        const retireNodeButton = screen
            .getByText('Retire node')
            .closest('button');
        expect(retireNodeButton.hasAttribute('disabled')).toBe(false);
    });
});
