// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { renderHook } from '@testing-library/react-hooks';
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

    describe('Messages on a required context', () => {
        it('should return message for a required field', () => {
            const { result } = renderHook(() => useMessages('required.field'));
            expect(result.current).toEqual('This field is required.');
        });
    });
});
