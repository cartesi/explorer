// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { StakingImpl, PoS } from '@cartesi/pos';
import Layout, { headerLinks, footerLinks } from '../../src/components/Layout';
import {
    useCartesiTokenContract,
    usePoSContract,
    useSimpleFaucetContract,
    useStakingContract,
    useStakingPoolFactoryContract,
    useWorkerManagerContract,
} from '../../src/services/contracts';
import useMeta from '../../src/graphql/hooks/useMeta';
import { withChakraTheme } from '../test-utilities';
import { CartesiToken, SimpleFaucet } from '@cartesi/token';
import { StakingPoolFactoryImpl } from '@cartesi/staking-pool';
import { WorkerManagerAuthManagerImpl } from '@cartesi/util';

jest.mock('../../src/services/contracts', () => {
    const original = jest.requireActual('../../src/services/contracts');
    return {
        __esModule: true,
        ...original,
        useCartesiTokenContract: jest.fn(),
        usePoSContract: jest.fn(),
        useSimpleFaucetContract: jest.fn(),
        useStakingContract: jest.fn(),
        useStakingPoolFactoryContract: jest.fn(),
        useWorkerManagerContract: jest.fn(),
    };
});

jest.mock('../../src/graphql/hooks/useMeta');

const address = '0x2942aa4356783892c624125acfbbb80d29629a9d';
const mockedUseCartesiTokenContract =
    useCartesiTokenContract as jest.MockedFunction<
        typeof useCartesiTokenContract
    >;
const mockedUsePoSContract = usePoSContract as jest.MockedFunction<
    typeof usePoSContract
>;
const mockedUseSimpleFaucetContract =
    useSimpleFaucetContract as jest.MockedFunction<
        typeof useSimpleFaucetContract
    >;
const mockedUseStakingContract = useStakingContract as jest.MockedFunction<
    typeof useStakingContract
>;
const mockedUseStakingPoolFactoryContract =
    useStakingPoolFactoryContract as jest.MockedFunction<
        typeof useStakingPoolFactoryContract
    >;
const mockedUseWorkerManagerContract =
    useWorkerManagerContract as jest.MockedFunction<
        typeof useWorkerManagerContract
    >;
const mockedUseMeta = useMeta as jest.MockedFunction<typeof useMeta>;

const Component = withChakraTheme(Layout);

describe('Layout component', () => {
    beforeEach(() => {
        mockedUsePoSContract.mockReturnValue({
            address,
        } as unknown as PoS);
        mockedUseCartesiTokenContract.mockReturnValue({
            address,
        } as unknown as CartesiToken);
        mockedUseSimpleFaucetContract.mockReturnValue({
            address,
        } as unknown as SimpleFaucet);
        mockedUseStakingContract.mockReturnValue({
            address,
        } as unknown as StakingImpl);
        mockedUseStakingPoolFactoryContract.mockReturnValue({
            address,
        } as unknown as StakingPoolFactoryImpl);
        mockedUseWorkerManagerContract.mockReturnValue({
            address,
        } as unknown as WorkerManagerAuthManagerImpl);
        mockedUseMeta.mockReturnValue(undefined);
    });

    it('should display correct header links', () => {
        render(<Component>Footer</Component>);

        headerLinks.forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });

    it('should display correct footer links', () => {
        render(<Component>Footer</Component>);

        footerLinks.forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });
});
