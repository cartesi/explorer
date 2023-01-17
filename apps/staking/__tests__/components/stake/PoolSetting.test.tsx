// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useWallet } from '@explorer/wallet';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BigNumber } from 'ethers';
import { PoolSetting } from '../../../src/components/stake/PoolSetting';
import useStakingPoolQuery from '../../../src/graphql/hooks/useStakingPool';
import useTotalPoolBalance from '../../../src/graphql/hooks/useTotalPoolBalance';
import { useStakingPoolFactory } from '../../../src/services/poolFactory';
import { withChakraTheme } from '../../test-utilities';
import { buildUseStakingPoolFactoryReturn } from '../pools/mocks';

const pool = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const poolFactoryPath = '../../../src/services/poolFactory';
const totalPoolBalance = '100000000000000000000000000000000';

jest.mock('@explorer/wallet');
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

jest.mock('../../../src/graphql/hooks/useTotalPoolBalance');
const mockUseTotalPoolBalance = useTotalPoolBalance as jest.MockedFunction<
    typeof useTotalPoolBalance
>;

jest.mock('../../../src/graphql/hooks/useStakingPool');
const mockUseStakingPoolQuery = useStakingPoolQuery as jest.MockedFunction<
    typeof useStakingPoolQuery
>;

jest.mock(poolFactoryPath, () => {
    const originalModule = jest.requireActual(poolFactoryPath);
    return {
        __esModule: true,
        ...originalModule,
        useStakingPoolFactory: jest.fn(),
    };
});

const mockUseStakingPoolFactory = useStakingPoolFactory as jest.MockedFunction<
    typeof useStakingPoolFactory
>;

const EPoolSetting = withChakraTheme(PoolSetting);

describe('PoolSetting', () => {
    const renderComponent = () => render(<EPoolSetting address={pool} />);

    beforeEach(() => {
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 3,
        });

        mockUseStakingPoolFactory.mockReturnValue(
            buildUseStakingPoolFactoryReturn()
        );

        mockUseTotalPoolBalance.mockReturnValue(
            BigNumber.from(totalPoolBalance)
        );

        mockUseStakingPoolQuery.mockReturnValue({
            id: '1231',
            manager: 'manager',
            user: {
                id: '1293891',
                stakedBalance: '10000',
                maturingBalance: '10000',
                maturingTimestamp: new Date().getTime(),
                releasingBalance: '10000',
                releasingTimestamp: new Date().getTime(),
                balance: '10000',
                totalBlocks: 100,
                totalReward: '100000000',
            },
            fee: {
                id: '1293891',
                commission: 10,
                gas: 25,
                created: new Date().getTime(),
                lastUpdated: new Date().getTime(),
            },
            amount: '100000000',
            shares: '100000000',
            totalUsers: 10,
            totalCommission: '100000000',
            commissionPercentage: 15,
            paused: false,
            timestamp: new Date().getTime(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('Should display header text', () => {
        renderComponent();
        expect(screen.getByText('Pool Setting')).toBeInTheDocument();
    });

    it('Should display required text for balance tooltip', async () => {
        renderComponent();
        const text = 'Total amount of tokens staked in this pool';

        const icon = screen.getByRole('balance-icon');
        await act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('Should display required text for pool tooltip', async () => {
        renderComponent();
        const text = 'Enter a registered ENS domain name';

        const icon = screen.getByRole('pool-icon');
        await act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('Should display required text for staking tooltip', async () => {
        renderComponent();
        const text = 'Open or close the pool for new stakes';

        const icon = screen.getByRole('staking-icon');
        await act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('Should display quit tooltip', async () => {
        renderComponent();
        const text =
            "If you don't want to keep the pool active, it can be disabled with our help";

        const icon = screen.getByRole('quit-icon');
        await act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });
});
