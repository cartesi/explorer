// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import Layout, {
    footerGeneral,
    footerLinks,
    footerSupport,
    headerLinks,
} from '../../src/components/Layout';
import {
    UnsupportedNetworkError,
    WalletConnectionContext,
} from '../../src/components/wallet';
import { supportedChainIds } from '../../src/components/wallet/chains';
import useMeta from '../../src/graphql/hooks/useMeta';
import {
    cartesiTokenAddress,
    posAddress,
    stakingAddress,
    stakingPoolFactoryAddress,
    workerManagerAuthManagerAddress,
} from '../../src/services/contracts/generated';
import { withChakraTheme } from '../test-utilities';

jest.mock('../../src/graphql/hooks/useMeta');
jest.mock('next/navigation', () => {
    const originalModule = jest.requireActual('next/navigation');
    return {
        __esModule: true,
        ...originalModule,
        useRouter: jest.fn(),
    };
});

const mockedUseMeta = useMeta as jest.MockedFunction<typeof useMeta>;
const Component = withChakraTheme(Layout);

const renderWithChain = (chainId?: number, error?: Error) =>
    render(
        <WalletConnectionContext.Provider
            value={{
                active: chainId !== undefined,
                chainId,
                error,
                activate: async () => undefined,
                deactivate: () => undefined,
            }}
        >
            <Component>Footer</Component>
        </WalletConnectionContext.Provider>,
    );

const etherscanLink = (host: string, address: string) =>
    `a[href="https://${host}/address/${address}"]`;

describe('Layout component', () => {
    beforeEach(() => {
        mockedUseMeta.mockReturnValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display correct header links', () => {
        render(<Component>Footer</Component>);

        headerLinks.forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });

    it('should display correct footer links', () => {
        render(<Component>Footer</Component>);

        [...footerLinks, ...footerSupport, ...footerGeneral].forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });

    it('should display the mainnet contracts while the wallet is disconnected', () => {
        const { container } = renderWithChain();

        [
            cartesiTokenAddress,
            posAddress,
            stakingAddress,
            workerManagerAuthManagerAddress,
            stakingPoolFactoryAddress,
        ].forEach((addresses) => {
            expect(
                container.querySelector(
                    etherscanLink('etherscan.io', addresses[1]),
                ),
            ).toBeInTheDocument();
        });
        // The faucet has no mainnet deployment.
        expect(screen.queryByText('Faucet')).not.toBeInTheDocument();
    });

    it('should display the contracts of the connected chain', () => {
        const { container } = renderWithChain(11155111);

        expect(
            container.querySelector(
                etherscanLink(
                    'sepolia.etherscan.io',
                    cartesiTokenAddress[11155111],
                ),
            ),
        ).toBeInTheDocument();
        expect(screen.getByText('Faucet')).toBeInTheDocument();
    });

    it('should hide the contracts on an unsupported network', () => {
        // The provider leaves chainId out while the network is unsupported.
        const { container } = renderWithChain(
            undefined,
            new UnsupportedNetworkError(8453, supportedChainIds),
        );

        expect(screen.getByText('Contracts')).toBeInTheDocument();
        expect(
            container.querySelector('a[href*="etherscan.io/address/"]'),
        ).not.toBeInTheDocument();
    });
});
