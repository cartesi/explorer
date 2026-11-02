// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    clearWalletDebugFlag,
    isWalletDebugEnabled,
    isWalletDebugMinimized,
    setWalletDebugMinimized,
    WALLET_DEBUG_STORAGE_KEY,
} from '../../../../src/components/wallet/debug/walletDebugFlag';

const visit = (path: string) => window.history.replaceState(null, '', path);
const nodeEnv = process.env.NODE_ENV;

describe('wallet debug flag', () => {
    afterEach(() => {
        window.localStorage.clear();
        visit('/');
        Object.assign(process.env, { NODE_ENV: nodeEnv });
        jest.restoreAllMocks();
    });

    it('is off by default', () => {
        expect(isWalletDebugEnabled()).toBe(false);
    });

    it('is never on in production builds', () => {
        Object.assign(process.env, { NODE_ENV: 'production' });
        window.localStorage.setItem(WALLET_DEBUG_STORAGE_KEY, '1');

        visit('/?walletDebug=1');

        expect(isWalletDebugEnabled()).toBe(false);
    });

    it('turns on with ?walletDebug=1 and stays on without the query', () => {
        visit('/?walletDebug=1');
        expect(isWalletDebugEnabled()).toBe(true);

        visit('/stake');
        expect(isWalletDebugEnabled()).toBe(true);
    });

    it('turns off with ?walletDebug=0', () => {
        window.localStorage.setItem(WALLET_DEBUG_STORAGE_KEY, '1');

        visit('/?walletDebug=0');

        expect(isWalletDebugEnabled()).toBe(false);
        visit('/');
        expect(isWalletDebugEnabled()).toBe(false);
    });

    it('is forgotten by clearWalletDebugFlag, along with the minimized state', () => {
        window.localStorage.setItem(WALLET_DEBUG_STORAGE_KEY, '1');
        setWalletDebugMinimized(true);

        clearWalletDebugFlag();

        expect(isWalletDebugEnabled()).toBe(false);
        expect(isWalletDebugMinimized()).toBe(false);
    });

    it('remembers whether the overlay is minimized', () => {
        expect(isWalletDebugMinimized()).toBe(false);

        setWalletDebugMinimized(true);
        expect(isWalletDebugMinimized()).toBe(true);

        setWalletDebugMinimized(false);
        expect(isWalletDebugMinimized()).toBe(false);
    });

    it('follows the query when storage is unavailable', () => {
        const blocked = () => {
            throw new Error('blocked');
        };
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked);
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked);

        visit('/?walletDebug=1');
        expect(isWalletDebugEnabled()).toBe(true);
        visit('/');
        expect(isWalletDebugEnabled()).toBe(false);
    });
});
