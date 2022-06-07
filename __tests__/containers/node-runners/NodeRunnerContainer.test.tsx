/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NodeRunnersContainer } from '../../../src/containers/node-runners/NodeRunnerContainer';
import { UseWallet } from '../../../src/contexts/wallet';
import { NextRouter } from 'next/router';
import { withChakraTheme } from '../../test-utilities';

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
