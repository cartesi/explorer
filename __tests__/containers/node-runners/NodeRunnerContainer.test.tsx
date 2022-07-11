/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    cleanup,
    fireEvent,
    prettyDOM,
    render,
    screen,
} from '@testing-library/react';
import { NodeRunnersContainer } from '../../../src/containers/node-runners/NodeRunnerContainer';
import { UseWallet } from '../../../src/contexts/wallet';
import { NextRouter } from 'next/router';
import { withChakraTheme } from '../../test-utilities';
import { useUserNodes } from '../../../src/graphql/hooks/useNodes';
import useStakingPools from '../../../src/graphql/hooks/useStakingPools';
import { buildUseStakingPoolsReturn, buildUseUserNodesReturn } from '../mocks';

const useNodesMod = '../../../src/graphql/hooks/useNodes';

jest.mock('../../../src/graphql/hooks/useStakingPools');
jest.mock(useNodesMod, () => {
    const originalModules = jest.requireActual(useNodesMod);
    return {
        __esModule: true,
        ...originalModules,
        useUserNodes: jest.fn(),
    };
});

const useUserNodeStub = useUserNodes as jest.MockedFunction<
    typeof useUserNodes
>;
const useStakingPoolsStub = useStakingPools as jest.MockedFunction<
    typeof useStakingPools
>;

let wallet: UseWallet;
let router: NextRouter;
const ENodeRunnerContainer = withChakraTheme(NodeRunnersContainer);

describe('NodeRunners container (Landing Page)', () => {
    beforeEach(() => {
        // mocking what is necessary in a default state.
        wallet = {
            activate: jest.fn(),
            deactivate: jest.fn(),
            active: false,
        };

        //@ts-ignore
        router = {
            push: jest.fn(),
        };

        useUserNodeStub.mockReturnValue(buildUseUserNodesReturn());
        useStakingPoolsStub.mockReturnValue(buildUseStakingPoolsReturn());
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    describe('when wallet is connected', () => {
        beforeEach(() => {
            wallet.active = true;
        });

        it('Should display the cards and the expected wording', () => {
            render(<ENodeRunnerContainer wallet={wallet} router={router} />);
            expect(screen.getByText('Node Runners')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'This area is for the node runner users including public pool manager or private node runner.'
                )
            ).toBeInTheDocument();

            expect(
                screen.getByText('Create a node or pool in steps')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Create a public pool')
            ).toBeInTheDocument();

            expect(
                screen.getByText('Earn commissions out of the blocks rewards.')
            ).toBeInTheDocument();

            expect(screen.getByText('CREATE PUBLIC POOL')).toBeInTheDocument();

            expect(screen.getByText('Run a private node')).toBeInTheDocument();

            expect(
                screen.getByText(
                    'You are able to stake directly by running your own node to represent your stake.'
                )
            ).toBeInTheDocument();

            expect(screen.getByText('CREATE MY NODE')).toBeInTheDocument();
        });

        it('should target to /node/new when click `CREATE MY NODE`', () => {
            render(<ENodeRunnerContainer wallet={wallet} router={router} />);

            fireEvent.click(screen.getByText('CREATE MY NODE'));

            expect(router.push).toHaveBeenCalledWith('/node/new');
        });

        it('should target to /pools/new when click `CREATE PUBLIC POOL`', () => {
            render(<ENodeRunnerContainer wallet={wallet} router={router} />);

            fireEvent.click(screen.getByText('CREATE PUBLIC POOL'));

            expect(router.push).toHaveBeenCalledWith('/pools/new');
        });

        it('should display tooltip for private node creation banner', async () => {
            render(<ENodeRunnerContainer wallet={wallet} router={router} />);

            const tooltipIcon = screen.getByTestId(
                'private-node-creation-card-tooltip-icon'
            );

            fireEvent.click(tooltipIcon);

            expect(
                await screen.findByText('Main responsabilities:')
            ).toBeInTheDocument();
            expect(
                await screen.findByText(
                    'Make sure the Noether node is online and works properly 24x7.'
                )
            ).toBeInTheDocument();
            expect(
                await screen.findByText(
                    'Pay the Ethereum fees that are necessary for block production and also maintenance operations.'
                )
            ).toBeInTheDocument();
        });

        it('should display tooltip for public pool creation banner', async () => {
            render(<ENodeRunnerContainer wallet={wallet} router={router} />);

            const tooltipIcon = screen.getByTestId(
                'pool-creation-card-tooltip-icon'
            );

            fireEvent.click(tooltipIcon);

            expect(
                await screen.findByText('Main responsabilities:')
            ).toBeInTheDocument();
            expect(
                await screen.findByText(
                    'Make sure the Noether node is online and works properly 24x7.'
                )
            ).toBeInTheDocument();
            expect(
                await screen.findByText(
                    'Have a relatively large amount of CTSI to stake.'
                )
            ).toBeInTheDocument();
        });
    });

    describe('when wallet is not connected', () => {
        it('should display informative message and a button to connect to the wallet', () => {
            render(<ENodeRunnerContainer wallet={wallet} router={router} />);

            expect(
                screen.getByText(
                    'Please connect your wallet if you have created your own node and pool already'
                )
            ).toBeInTheDocument();

            expect(screen.getByText('CONNECT WALLET')).toBeInTheDocument();
        });

        it('should call the wallet activate method when clicks the `CONNECT WALLET`', () => {
            render(<ENodeRunnerContainer wallet={wallet} router={router} />);

            fireEvent.click(screen.getByText('CONNECT WALLET'));

            expect(wallet.activate).toHaveBeenCalled();
        });
    });
});
