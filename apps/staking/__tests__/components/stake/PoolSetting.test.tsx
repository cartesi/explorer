// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useWallet } from '@explorer/wallet';
import {
    act,
    cleanup,
    fireEvent,
    getByText,
    render,
    screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFlag } from '@unleash/proxy-client-react';
import { BigNumber } from 'ethers';
import { PoolSetting } from '../../../src/components/stake/PoolSetting';
import useStakingPoolQuery from '../../../src/graphql/hooks/useStakingPool';
import useTotalPoolBalance from '../../../src/graphql/hooks/useTotalPoolBalance';
import { useStakingPool } from '../../../src/services/pool';
import { useStakingPoolFactory } from '../../../src/services/poolFactory';
import { withChakraTheme } from '../../test-utilities';
import {
    buildUseStakingPoolFactoryReturn,
    buildUseStakingPoolReturn,
} from '../pools/mocks';

useStakingPool;

const pool = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const poolFactoryPath = '../../../src/services/poolFactory';
const servicePoolPath = '../../../src/services/pool';
const totalPoolBalance = '100000000000000000000000000000000';

jest.mock('@unleash/proxy-client-react');
const mockUseFlag = useFlag as jest.MockedFunction<typeof useFlag>;

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

jest.mock(servicePoolPath, () => {
    const orig = jest.requireActual(servicePoolPath);
    return {
        __esModule: true,
        ...orig,
        useStakingPool: jest.fn(),
    };
});

const mockUseStakingPool = useStakingPool as jest.MockedFunction<
    typeof useStakingPool
>;

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

        // default flag return
        mockUseFlag.mockReturnValue(false);

        const stakingPool = buildUseStakingPoolReturn();
        stakingPool.address = pool;
        mockUseStakingPool.mockReturnValue(stakingPool);

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

    describe('when posV2Enabled is enabled', () => {
        const posAddress = '0x508ec215ba5fd8da80bbccf8168e02018e043695';
        let stakingPool: ReturnType<typeof buildUseStakingPoolReturn>;
        let factory: ReturnType<typeof buildUseStakingPoolFactoryReturn>;
        beforeEach(() => {
            mockUseFlag.mockReturnValue(true);
            stakingPool = buildUseStakingPoolReturn();
            factory = buildUseStakingPoolFactoryReturn();
        });

        it('should not display a banner action when pool and pool-factory pos matches', () => {
            stakingPool.address = pool;
            stakingPool.pos = posAddress;
            mockUseStakingPool.mockReturnValue(stakingPool);
            factory.pos = posAddress;
            mockUseStakingPoolFactory.mockReturnValue(factory);

            renderComponent();
            expect(
                screen.queryByText('Pool manager action')
            ).not.toBeInTheDocument();
        });

        it('should display action banner for managers when pos is not matching', () => {
            stakingPool.address = pool;
            stakingPool.pos = '0x508ec215ba5fd8da80bbccf8168e02018e043696';
            mockUseStakingPool.mockReturnValue(stakingPool);
            factory.pos = posAddress;
            mockUseStakingPoolFactory.mockReturnValue(factory);

            renderComponent();

            expect(screen.getByText('Pool manager action')).toBeInTheDocument();

            expect(
                screen.getByText(
                    'upgrade your staking pool to use the new PoS version 2'
                )
            ).toBeInTheDocument();

            const updateButton = screen.getByText(
                'upgrade your staking pool to use the new PoS version 2'
            ).nextElementSibling;

            expect(updateButton).toBeDefined();
        });

        it('should call the update method when clicking the update button', () => {
            stakingPool.address = pool;
            stakingPool.pos = '0x508ec215ba5fd8da80bbccf8168e02018e043696';
            mockUseStakingPool.mockReturnValue(stakingPool);
            factory.pos = posAddress;
            mockUseStakingPoolFactory.mockReturnValue(factory);

            renderComponent();
            const el = screen.getByTestId('posV2Alert');
            const button = getByText(el, 'Update');

            act(() => {
                fireEvent.click(button);
            });

            expect(stakingPool.update).toHaveBeenCalledTimes(1);
        });
    });
});
