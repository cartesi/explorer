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
import { useDisclosure } from '@chakra-ui/react';
import { BigNumber, ContractTransaction } from 'ethers';
import { Staking, StakingProps } from '../../../src/components/stake/Staking';
import { withChakraTheme } from '../../test-utilities';
import { Transaction } from '../../../src/services/transaction';

jest.mock('@chakra-ui/react');
const mockUseDisclosure = useDisclosure as jest.MockedFunction<
    typeof useDisclosure
>;

const defaultValue = '10000000000000000000000000000';

const defaultTransaction: Transaction<any> = {
    ack: jest.fn(),
    acknowledged: false,
    error: undefined,
    receipt: undefined,
    result: undefined,
    set: jest.fn(),
    submitting: false,
    transaction: {
        hash: '0x6200d8606aab695a7f730a3f7c60e399eb3bd10f',
        chainId: 1823981,
    } as ContractTransaction,
};

const defaultProps = {
    userWalletBalance: BigNumber.from(defaultValue),
    allowance: BigNumber.from(defaultValue),
    userPoolBalance: BigNumber.from(defaultValue),
    userETHBalance: BigNumber.from(defaultValue),
    stakedBalance: BigNumber.from(defaultValue),
    depositTimestamp: new Date(),
    lockTime: 1000,
    onApprove: () => undefined,
    onDeposit: () => undefined,
    onWithdraw: () => undefined,
    onStake: () => undefined,
    onUnstake: () => undefined,
    poolTransaction: defaultTransaction,
    tokenTransaction: defaultTransaction,
};

const EStaking = withChakraTheme<StakingProps>(Staking);

describe('Staking', () => {
    // a default configured component
    const renderComponent = () => render(<EStaking {...defaultProps} />);

    beforeEach(() => {
        mockUseDisclosure.mockReturnValue({
            getButtonProps: () => undefined,
            getDisclosureProps: () => undefined,
            isControlled: false,
            onToggle: () => undefined,
            isOpen: false,
            onOpen: () => undefined,
            onClose: () => undefined,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('Should display header text', () => {
        renderComponent();
        expect(screen.getByText('Setting allowance...')).toBeInTheDocument();
    });
});
