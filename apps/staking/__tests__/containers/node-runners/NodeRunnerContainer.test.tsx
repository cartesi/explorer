/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { UseWallet } from '@explorer/wallet/src/useWallet';
import {
    findByText,
    fireEvent,
    getByRole,
    getByTestId,
    getByText,
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react';
import { useFlag } from '@unleash/proxy-client-react';
import { NextRouter } from 'next/router';
import { act } from 'react';
import { NodeRunnersContainer } from '../../../src/containers/node-runners/NodeRunnerContainer';
import { useUserNodes } from '../../../src/graphql/hooks/useNodes';
import useStakingPools from '../../../src/graphql/hooks/useStakingPools';
import { ENSEntry, useENS } from '../../../src/services/ens';
import { useCartesiToken } from '../../../src/services/token';
import { useMessages } from '../../../src/utils/messages';
import { withChakraTheme } from '../../test-utilities';
import {
    buildUseCartesiTokenReturn,
    buildUseStakingPoolsReturn,
    buildUseUserNodesReturn,
    generateNodeData,
    generateStakingPoolsData,
} from '../mocks';

const useNodesMod = '../../../src/graphql/hooks/useNodes';
const useENSMod = '../../../src/services/ens';

jest.mock('../../../src/services/token', () => {
    return {
        __esModule: true,
        useCartesiToken: jest.fn(),
    };
});

jest.mock('@unleash/proxy-client-react', () => {
    const original = jest.requireActual('@unleash/proxy-client-react');
    return {
        __esModule: true,
        ...original,
        useFlag: jest.fn(),
    };
});

jest.mock(useENSMod, () => {
    const original = jest.requireActual(useENSMod);
    return {
        __esModule: true,
        ...original,
        useENS: jest.fn(),
    };
});
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
const useENSStub = useENS as jest.MockedFunction<typeof useENS>;
const useCartesiTokenStub = useCartesiToken as jest.MockedFunction<
    typeof useCartesiToken
>;

const useFlagStub = useFlag as jest.MockedFunction<typeof useFlag>;

const ENodeRunnerContainer = withChakraTheme(NodeRunnersContainer);

const buildWallet = (): UseWallet => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
    active: false,
});

describe('NodeRunners container (Landing Page)', () => {
    let wallet: UseWallet;
    let router: NextRouter;

    beforeEach(() => {
        // mocking what is necessary in a default state.
        wallet = buildWallet();

        //@ts-ignore
        router = {
            push: jest.fn(),
        };

        useFlagStub.mockReturnValue(false);
        useUserNodeStub.mockReturnValue(buildUseUserNodesReturn());
        useStakingPoolsStub.mockReturnValue(buildUseStakingPoolsReturn());
        useENSStub.mockReturnValue({} as ENSEntry);
        useCartesiTokenStub.mockReturnValue(buildUseCartesiTokenReturn());
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('when wallet is connected', () => {
        const account = '0xa074683b5be015f053b5dceb064c41fc9d11b6e5';
        beforeEach(() => {
            wallet = buildWallet();
            wallet.active = true;
            wallet.account = account;
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
                await screen.findByText('Main responsibilities:')
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
                await screen.findByText('Main responsibilities:')
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

        describe('When user has pools', () => {
            it('should display a table with pools information with described headers', async () => {
                const mock = buildUseStakingPoolsReturn();
                mock.data = generateStakingPoolsData().data;
                useStakingPoolsStub.mockReturnValue(mock);

                render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                const firstRow = await screen
                    .getByText('0xe58...731b')
                    .closest('tr');

                expect(
                    await screen.findByText('Pool Management')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('CREATE A POOL')
                ).toBeInTheDocument();
                expect(await screen.findByText('Address')).toBeInTheDocument();
                expect(
                    await screen.findByText('Total Staked')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Total Users')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Total Rewards')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Commission')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Pool Balance')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Node Status')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Block Produced')
                ).toBeInTheDocument();
                expect(await screen.findByText('Manage')).toBeInTheDocument();

                // checking some row values
                expect(
                    await findByText(firstRow, '50,000')
                ).toBeInTheDocument();

                expect(
                    await findByText(firstRow, 'Not Hired')
                ).toBeInTheDocument();
            });

            it('should remove the usual card for public pool creation', async () => {
                const { rerender, queryByText } = render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                expect(
                    screen.getByText('Create a public pool')
                ).toBeInTheDocument();
                expect(
                    screen.getByText(
                        'Earn commissions out of the blocks rewards.'
                    )
                ).toBeInTheDocument();
                expect(
                    screen.getByText('CREATE PUBLIC POOL')
                ).toBeInTheDocument();

                //then load the data
                const mock = buildUseStakingPoolsReturn();
                mock.data = generateStakingPoolsData().data;
                useStakingPoolsStub.mockReturnValue(mock);

                rerender(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                await waitForElementToBeRemoved(() =>
                    queryByText('Create a public pool')
                );

                expect(
                    screen.queryByText('Create a public pool')
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByText(
                        'Earn commissions out of the blocks rewards.'
                    )
                ).not.toBeInTheDocument();

                expect(
                    screen.queryByText('CREATE PUBLIC POOL')
                ).not.toBeInTheDocument();
            });

            it('should display a feedback message in the table cell while checking the node status', async () => {
                const userNodes = buildUseUserNodesReturn();
                userNodes.loading = true;
                useUserNodeStub.mockReturnValue(userNodes);
                const stakingPools = buildUseStakingPoolsReturn();
                stakingPools.data = generateStakingPoolsData().data;
                useStakingPoolsStub.mockReturnValue(stakingPools);
                render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                const firstRow = screen.getByText('0xe58...731b').closest('tr');

                expect(getByText(firstRow, 'Loading')).toBeInTheDocument();
            });

            it('should be able to click on the sortable headers', () => {
                const stakingPools = buildUseStakingPoolsReturn();
                stakingPools.data = generateStakingPoolsData().data;
                useStakingPoolsStub.mockReturnValue(stakingPools);
                render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                fireEvent.click(screen.getByText('Total Staked'));

                fireEvent.click(screen.getByText('Total Users'));

                fireEvent.click(screen.getByText('Commission'));

                expect(useStakingPoolsStub).toHaveBeenCalledTimes(5);

                //there are two render cycles happening so we check from the third call forward

                expect(useStakingPoolsStub.mock.calls[2][0]).toHaveProperty(
                    'sort',
                    'amount'
                );

                expect(useStakingPoolsStub.mock.calls[3][0]).toHaveProperty(
                    'sort',
                    'totalUsers'
                );

                expect(useStakingPoolsStub.mock.calls[4][0]).toHaveProperty(
                    'sort',
                    'commissionPercentage'
                );
            });

            it('should display a loading spinner as the first row when re-fetching data', () => {
                const stakingPools = buildUseStakingPoolsReturn();
                stakingPools.data = generateStakingPoolsData().data;
                useStakingPoolsStub.mockReturnValue(stakingPools);
                const { rerender } = render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                expect(screen.getByText('0xe58...731b')).toBeInTheDocument();

                const updatedData = buildUseStakingPoolsReturn();
                updatedData.loading = true;
                useStakingPoolsStub.mockReturnValue(updatedData);

                rerender(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                expect(
                    screen.queryByText('0xe58...731b')
                ).not.toBeInTheDocument();

                expect(screen.getByText('Loading')).toBeInTheDocument();
            });

            describe('with PoS V2 feature flag enabled', () => {
                it('should display a warning banner with steps to upgrade the pool', () => {
                    const mock = buildUseStakingPoolsReturn();
                    mock.data = generateStakingPoolsData().data;
                    useStakingPoolsStub.mockReturnValue(mock);
                    useFlagStub.mockReturnValue(true);

                    render(
                        <ENodeRunnerContainer wallet={wallet} router={router} />
                    );

                    expect(
                        screen.getByText(useMessages('pos.v2'))
                    ).toBeInTheDocument();
                    expect(
                        screen.getByText(
                            useMessages('pool.update.pos.steps.title')
                        )
                    ).toBeInTheDocument();

                    expect(
                        screen.getByText(
                            useMessages('pool.update.pos.steps.one')
                        )
                    ).toBeInTheDocument();

                    expect(
                        screen.getByText(
                            useMessages('pool.update.pos.steps.two')
                        )
                    ).toBeInTheDocument();

                    expect(
                        screen.getByText(
                            useMessages('pool.update.pos.steps.three')
                        )
                    ).toBeInTheDocument();

                    expect(
                        screen.getByText(
                            useMessages('pool.update.pos.steps.four')
                        )
                    ).toBeInTheDocument();
                });

                it('should close the banner when clicking the close button', () => {
                    const mock = buildUseStakingPoolsReturn();
                    mock.data = generateStakingPoolsData().data;
                    useStakingPoolsStub.mockReturnValue(mock);
                    useFlagStub.mockReturnValue(true);

                    render(
                        <ENodeRunnerContainer wallet={wallet} router={router} />
                    );

                    // Checking the banner is rendered
                    expect(
                        screen.getByText(useMessages('pos.v2'))
                    ).toBeInTheDocument();

                    const alert = screen.getByTestId('bannerPoolPoSV2');

                    act(() => {
                        fireEvent.click(getByRole(alert, 'close-button'));
                    });

                    expect(
                        screen.queryByText(useMessages('pos.v2'))
                    ).not.toBeInTheDocument();
                });

                it('should close the banner when clicking the dont-show-again', () => {
                    const mock = buildUseStakingPoolsReturn();
                    mock.data = generateStakingPoolsData().data;
                    useStakingPoolsStub.mockReturnValue(mock);
                    useFlagStub.mockReturnValue(true);

                    render(
                        <ENodeRunnerContainer wallet={wallet} router={router} />
                    );

                    // Checking the banner is rendered
                    expect(
                        screen.getByText(useMessages('pos.v2'))
                    ).toBeInTheDocument();

                    act(() => {
                        fireEvent.click(screen.getByText("Don't show again"));
                    });

                    expect(
                        screen.queryByText(useMessages('pos.v2'))
                    ).not.toBeInTheDocument();
                });
            });

            describe('with PoS V2 feature flag disabled', () => {
                it('should not display the warning banner with steps to migrate the pool', () => {
                    const mock = buildUseStakingPoolsReturn();
                    mock.data = generateStakingPoolsData().data;
                    useStakingPoolsStub.mockReturnValue(mock);

                    render(
                        <ENodeRunnerContainer wallet={wallet} router={router} />
                    );

                    expect(
                        screen.queryByText(
                            useMessages('pool.update.pos.steps.title')
                        )
                    ).not.toBeInTheDocument();
                });
            });
        });

        describe('When user has a private node', () => {
            it('should display a table with described headers', async () => {
                const mock = buildUseUserNodesReturn();
                mock.data = generateNodeData().data;
                useUserNodeStub.mockReturnValue(mock);
                render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                const row = await screen
                    .getByText('0x68a...e56c')
                    .closest('tr');

                expect(
                    await screen.findByText('Private Node Management')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Node Address')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Total Staked')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Total Rewards')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Block Produced')
                ).toBeInTheDocument();
                expect(
                    await screen.findByText('Node Status')
                ).toBeInTheDocument();
                expect(await screen.findByText('Manage')).toBeInTheDocument();

                // check some of the row values
                expect(await findByText(row, 'Hired')).toBeInTheDocument();
                expect(
                    await findByText(
                        row,
                        'Manage node 0x68a42decd906f86a893ec91d04468bc2a869e56c'
                    )
                ).toBeInTheDocument();
            });

            it('should display the correct staked balance value', async () => {
                const mock = buildUseUserNodesReturn();
                mock.data = generateNodeData().data;
                useUserNodeStub.mockReturnValue(mock);
                render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                const row = await screen
                    .getByText('0x68a...e56c')
                    .closest('tr');

                // staked balance
                expect(await findByText(row, '3,400')).toBeInTheDocument();
                // reward
                expect(await findByText(row, '10')).toBeInTheDocument();
                //blocks produced
                expect(await findByText(row, '1')).toBeInTheDocument();
            });

            it('should remove the card for private node creation', async () => {
                const { rerender } = render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                expect(
                    screen.getByText('Run a private node')
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        'You are able to stake directly by running your own node to represent your stake.'
                    )
                ).toBeInTheDocument();

                expect(screen.getByText('CREATE MY NODE')).toBeInTheDocument();

                const mock = buildUseUserNodesReturn();
                mock.data = generateNodeData().data;
                useUserNodeStub.mockReturnValue(mock);

                rerender(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                await waitForElementToBeRemoved(() =>
                    screen.queryByText('Run a private node')
                );

                expect(
                    screen.queryByText('Run a private node')
                ).not.toBeInTheDocument();
            });

            describe('with PoS V2 feature flag enabled', () => {
                it('should display a message to help with steps to migrate private node', () => {
                    const mock = buildUseUserNodesReturn();
                    mock.data = generateNodeData().data;
                    useUserNodeStub.mockReturnValue(mock);
                    useFlagStub.mockReturnValue(true);
                    render(
                        <ENodeRunnerContainer wallet={wallet} router={router} />
                    );

                    expect(
                        screen.getByText(useMessages('pos.v2'))
                    ).toBeInTheDocument();
                    expect(
                        screen.getByText(
                            useMessages('node.authorize.pos.steps.title')
                        )
                    ).toBeInTheDocument();

                    expect(
                        screen.getByText(
                            useMessages('node.authorize.pos.steps.one')
                        )
                    ).toBeInTheDocument();
                    expect(
                        screen.getByText(
                            useMessages('node.authorize.pos.steps.two')
                        )
                    ).toBeInTheDocument();

                    expect(
                        screen.getByText(
                            useMessages('node.authorize.pos.steps.three')
                        )
                    ).toBeInTheDocument();

                    expect(
                        screen.getByText(
                            useMessages('node.authorize.pos.steps.four')
                        )
                    ).toBeInTheDocument();

                    expect(
                        screen.getByText(`Don't show again`)
                    ).toBeInTheDocument();

                    expect(
                        screen
                            .getByRole('alert')
                            .querySelector('button[role="close-button"]')
                    ).toBeInTheDocument();
                });
            });

            describe('with PoS V2 feature flag disabled', () => {
                it('should not display the migration message for private node', async () => {
                    const mock = buildUseUserNodesReturn();
                    mock.data = generateNodeData().data;
                    useUserNodeStub.mockReturnValue(mock);
                    // default is returning false.
                    render(
                        <ENodeRunnerContainer wallet={wallet} router={router} />
                    );

                    expect(
                        screen.queryByText(useMessages('pos.v2'))
                    ).not.toBeInTheDocument();
                });
            });
        });

        describe('When user has both pools and a private node', () => {
            it('should not display any of the cards', async () => {
                const { rerender } = render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                expect(
                    screen.getByText('Run a private node')
                ).toBeInTheDocument();
                expect(screen.getByText('CREATE MY NODE')).toBeInTheDocument();
                expect(
                    screen.getByText('Create a public pool')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('CREATE PUBLIC POOL')
                ).toBeInTheDocument();

                expect(
                    screen.queryByText('Pool Management')
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByText('Private Node Management')
                ).not.toBeInTheDocument();

                const userNodes = buildUseUserNodesReturn();
                userNodes.data = generateNodeData().data;
                useUserNodeStub.mockReturnValue(userNodes);
                const stakingPools = buildUseStakingPoolsReturn();
                stakingPools.data = generateStakingPoolsData().data;
                useStakingPoolsStub.mockReturnValue(stakingPools);

                rerender(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                expect(
                    await screen.queryByText('Run a private node')
                ).not.toBeInTheDocument();
                expect(
                    await screen.queryByText('Create a public pool')
                ).not.toBeInTheDocument();
            });

            it('should display pool and node tables', () => {
                const userNodes = buildUseUserNodesReturn();
                userNodes.data = generateNodeData().data;
                useUserNodeStub.mockReturnValue(userNodes);
                const stakingPools = buildUseStakingPoolsReturn();
                stakingPools.data = generateStakingPoolsData().data;
                useStakingPoolsStub.mockReturnValue(stakingPools);

                render(
                    <ENodeRunnerContainer wallet={wallet} router={router} />
                );

                const poolTableEl = screen
                    .getByRole('columnheader', { name: 'Address' })
                    .closest('table');
                const nodeTableEl = screen
                    .getByRole('columnheader', { name: 'Node Address' })
                    .closest('table');

                expect(poolTableEl).toBeDefined();
                expect(nodeTableEl).toBeDefined();

                const poolFirstRowEl = screen
                    .getByText('0xe58...731b')
                    .closest('tr');

                expect(
                    getByText(
                        poolFirstRowEl,
                        'Manage pool 0xe584cd6dd071f532e9598e96589663e69330731b'
                    )
                ).toBeInTheDocument();

                expect(
                    getByTestId(
                        poolFirstRowEl,
                        'pencil-svg-0xe584cd6dd071f532e9598e96589663e69330731b'
                    )
                ).toBeInTheDocument();

                expect(getByText(poolFirstRowEl, '50,000')).toBeInTheDocument();

                expect(getByText(poolFirstRowEl, 'Hired')).toBeInTheDocument();

                const nodeRowEl = screen
                    .getByText('0x68a...e56c')
                    .closest('tr');

                expect(
                    getByText(
                        nodeRowEl,
                        'Manage node 0x68a42decd906f86a893ec91d04468bc2a869e56c'
                    )
                ).toBeInTheDocument();

                expect(
                    getByTestId(
                        nodeRowEl,
                        'pencil-svg-0x68a42decd906f86a893ec91d04468bc2a869e56c'
                    )
                ).toBeInTheDocument();
            });
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
