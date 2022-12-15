// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { renderHook } from '@testing-library/react';
import { useMessages } from '../../src/utils/messages';

describe('useMessages hook', () => {
    describe('Messages on a node context', () => {
        it('should have a message for node owned by me', () => {
            const { result } = renderHook(() => useMessages('node.owned.mine'));
            expect(result.current).toEqual(
                'Looks like you already own that node.'
            );
        });

        it('should have a message for node owned by someone else', () => {
            const { result } = renderHook(() =>
                useMessages('node.owned.notMine')
            );
            expect(result.current).toEqual(
                'Looks like that node is already owned.'
            );
        });

        it('should have a message for node that belongs to me but is pending', () => {
            const { result } = renderHook(() =>
                useMessages('node.pending.mine')
            );
            expect(result.current).toEqual(
                'Looks like the node is yours but it is in a pending state'
            );
        });

        it('should have a message for node pending and belongs to someone else', () => {
            const { result } = renderHook(() =>
                useMessages('node.pending.notMine')
            );
            expect(result.current).toEqual(
                'Looks like that node is already owned.'
            );
        });

        it('should have a message for a retired node', () => {
            const { result } = renderHook(() => useMessages('node.retired'));
            expect(result.current).toEqual('This node is already retired.');
        });

        it('should have a message when authorizing a node', () => {
            const { result } = renderHook(() =>
                useMessages('node.authorize.authorizing')
            );
            expect(result.current).toEqual(
                'Authorizing node to use new PoS...'
            );
        });

        it('should have a message when authorize action fails', () => {
            const { result } = renderHook(() =>
                useMessages('node.authorize.fail')
            );
            expect(result.current).toEqual('Node authorization failed!');
        });

        it('should have a message when authorize action succeed', () => {
            const { result } = renderHook(() =>
                useMessages('node.authorize.success')
            );
            expect(result.current).toEqual('Node authorized with success!');
        });
    });

    describe('Messages on deposit context', () => {
        it('should return a message for minimum allowed deposit based on parameter', () => {
            const { result } = renderHook(() =>
                useMessages('deposit.minAllowed', 0.001)
            );

            expect(result.current).toEqual(
                'Min amount of ETH allowed to deposit is 0.001'
            );
        });

        it('should return a message for min allowed value with different token (i.e. CTSI)', () => {
            const { result } = renderHook(() =>
                useMessages('deposit.minAllowed', 100, 'CTSI')
            );

            expect(result.current).toEqual(
                'Min amount of CTSI allowed to deposit is 100'
            );
        });

        it('should return a message for max allowed deposit based on param value', () => {
            const { result } = renderHook(() =>
                useMessages('deposit.maxAllowed', 2000)
            );

            expect(result.current).toEqual(
                'Max amount of ETH allowed to deposit is 2000'
            );
        });

        it('should return a message for max allowed amount using a different token (i.e. CTSI)', () => {
            const { result } = renderHook(() =>
                useMessages('deposit.maxAllowed', 100, 'CTSI')
            );

            expect(result.current).toEqual(
                'Max amount of CTSI allowed to deposit is 100'
            );
        });
    });

    describe('Messages on a field context', () => {
        it('should return message for a required field', () => {
            const { result } = renderHook(() =>
                useMessages('field.isRequired')
            );
            expect(result.current).toEqual('This field is required.');
        });

        describe('for greater than', () => {
            it('should return a default message for a field where value should be greater than', () => {
                const { result } = renderHook(() =>
                    useMessages('field.value.should.beGreaterThan')
                );
                expect(result.current).toEqual(
                    'Value should be greater than 0'
                );
            });

            it('should return a message with params for the value and the label (e.g. Allowance)', () => {
                const { result } = renderHook(() =>
                    useMessages(
                        'field.value.should.beGreaterThan',
                        100,
                        'Allowance'
                    )
                );
                expect(result.current).toEqual(
                    'Allowance should be greater than 100'
                );
            });
        });

        describe('for max allowed', () => {
            it('should return a default message when no params are pass', () => {
                const { result } = renderHook(() =>
                    useMessages('field.value.max.allowed')
                );
                expect(result.current).toEqual('Maximum value allowed is 0');
            });

            it('should return a message with params for the value and the label (e.g. Gas)', () => {
                const { result } = renderHook(() =>
                    useMessages('field.value.max.allowed', 10000, 'Gas')
                );
                expect(result.current).toEqual('Maximum Gas allowed is 10000');
            });
        });

        describe('for min allowed', () => {
            it('should return a default message when no params are pass', () => {
                const { result } = renderHook(() =>
                    useMessages('field.value.min.allowed')
                );
                expect(result.current).toEqual('Minimum value allowed is 0');
            });

            it('should return a message with params for the value and the label (e.g. ETH)', () => {
                const { result } = renderHook(() =>
                    useMessages('field.value.min.allowed', 15, 'ETH')
                );
                expect(result.current).toEqual('Minimum ETH allowed is 15');
            });
        });
    });

    describe('Messages on commission context', () => {
        describe('Models', () => {
            it('should return a message of how flat-rate works', () => {
                const { result } = renderHook(() =>
                    useMessages('commission.model.flatRate.howItWorks')
                );
                expect(result.current).toEqual(
                    'This model calculates the commission as a fixed percentage of the block CTSI reward before distributing the remaining amount to the pool users.'
                );
            });

            it('should return a message of how gas-based works', () => {
                const { result } = renderHook(() =>
                    useMessages('commission.model.gasBased.howItWorks')
                );
                expect(result.current).toEqual(
                    'This model calculates the commission considering the current network gas price, Ethereum price and CTSI price. The configured amount of gas above is multiplied by the gas price provided by a ChainLink oracle, then converted from ETH to CTSI using an Uniswap V2 price oracle.'
                );
            });
        });
    });

    describe('Messages on Pool context', () => {
        describe('For factory', () => {
            it('should return a message for not initialised', () => {
                const { result } = renderHook(() =>
                    useMessages('pool.factory.not.initialised')
                );
                expect(result.current).toEqual(
                    'The pool factory is not initialised properly.'
                );
            });
        });

        describe('For creation', () => {
            it('should return a message when paused', () => {
                const { result } = renderHook(() =>
                    useMessages('pool.creation.paused')
                );
                expect(result.current).toEqual(
                    'Creation of new pools is currently paused.'
                );
            });
        });
    });

    describe('Messages for general purporse', () => {
        describe('Notice', () => {
            it('should return a message for a found problem', () => {
                const { result } = renderHook(() =>
                    useMessages('notice.problem')
                );
                expect(result.current).toEqual('We notice a problem');
            });

            it('should return a message for a found problem with a suffix', () => {
                const { result } = renderHook(() =>
                    useMessages('notice.problem', ' in the setup')
                );
                expect(result.current).toEqual(
                    'We notice a problem in the setup'
                );
            });
        });
    });

    describe('Messages on balance context', () => {
        describe('For ETH', () => {
            it('should have a message to warn about available eth to pay for the transaction gas-costs', () => {
                const { result } = renderHook(() =>
                    useMessages('balance.eth.available.forGasCosts')
                );
                expect(result.current).toEqual(
                    'Please make sure you have sufficient ETH to proceed with the staking fee.'
                );
            });
        });
    });
});
