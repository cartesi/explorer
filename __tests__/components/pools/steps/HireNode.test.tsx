// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, render, screen } from '@testing-library/react';
import { useWallet } from '../../../../src/contexts/wallet';
import { useBalance } from '../../../../src/services/eth';
import { useNode } from '../../../../src/services/node';
import HireNode from '../../../../src/components/pools/steps/HireNode';
import { toBigNumber } from '../../../../src/utils/numberParser';
import { buildNodeObj } from '../../node/mocks';
import { useAtom } from 'jotai';

const walletMod = `../../../../src/contexts/wallet`;
const servicesEthMod = `../../../../src/services/eth`;
const servicesNodeMod = `../../../../src/services/node`;

/**
 * Looks repetitive but that is because the way Jest hoist the jest.mock calls to guarantee
 * it will run before the imports.
 */
jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

jest.mock(servicesEthMod, () => {
    const originalModule = jest.requireActual(servicesEthMod);
    return {
        __esModule: true,
        ...originalModule,
        useBalance: jest.fn(),
    };
});

jest.mock(servicesNodeMod, () => {
    const originalModule = jest.requireActual(servicesNodeMod);
    return {
        __esModule: true,
        ...originalModule,
        useNode: jest.fn(),
    };
});

jest.mock('jotai', () => {
    const originalModule = jest.requireActual('jotai');
    return {
        __esModule: true,
        ...originalModule,
        useAtom: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockUseNode = useNode as jest.MockedFunction<typeof useNode>;
const mockUseBalance = useBalance as jest.MockedFunction<typeof useBalance>;
const mockUseAtom = useAtom as jest.MockedFunction<typeof useAtom>;

describe('HireNode Step', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
    const atomSetterStub = jest.fn();

    beforeEach(() => {
        // Partial filled Happy returns
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 3,
        });

        mockUseBalance.mockReturnValue(toBigNumber('1'));
        mockUseNode.mockReturnValue(buildNodeObj());
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mockUseAtom.mockImplementation((...a: any) => ['', atomSetterStub]);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('Should render the step-number assigned to it', () => {
        render(<HireNode stepNumber={1} />);

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    describe('When not in focus', () => {
        it('Should only display the number, the title and the subtitle when not in focus', () => {
            render(<HireNode stepNumber={1} />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Hire Node')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'At this point, stake your funds using Cartesi Explorer.'
                )
            ).toBeInTheDocument();

            expect(screen.queryByText('Node Address')).not.toBeInTheDocument();
            expect(screen.queryByText('NEXT')).not.toBeInTheDocument();
        });
    });

    describe('When in focus', () => {
        it('Should display the header content, the body and action buttons', () => {
            render(<HireNode stepNumber={1} inFocus />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Hire Node')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'At this point, stake your funds using Cartesi Explorer.'
                )
            ).toBeInTheDocument();

            expect(screen.getByText('Node Address')).toBeInTheDocument();
            expect(
                screen.getByText('You may find from the docker configuration')
            ).toBeInTheDocument();
            expect(screen.getByText('Initial Funds')).toBeInTheDocument();
            expect(
                screen.getByText('Allowing your pool to accept new stakes')
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    'You need to specify the amount of ETH you want to give to your node. The node holds a separate Ethereum account and key pair, and only spends your ETH to accept being hired during setup (only once) and then to produce blocks. That means you only incur transaction fee expenses when you are rewarded with CTSI.'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('NEXT')).toBeInTheDocument();
        });
    });
});
