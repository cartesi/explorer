// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

const QUERY_PARAM = 'walletDebug';
export const WALLET_DEBUG_STORAGE_KEY = 'explorer:walletDebug';
export const WALLET_DEBUG_MINIMIZED_KEY = 'explorer:walletDebug:minimized';

// Storage throws in private mode or when blocked; the overlay then follows
// the query only.
const readFlag = (key: string): boolean => {
    try {
        return window.localStorage.getItem(key) === '1';
    } catch {
        return false;
    }
};

const writeFlag = (key: string, on: boolean): void => {
    try {
        if (on) window.localStorage.setItem(key, '1');
        else window.localStorage.removeItem(key);
    } catch {
        // see readFlag
    }
};

/**
 * `?walletDebug=1` turns the overlay on and remembers it (so in-app navigation
 * and reloads keep it); `?walletDebug=0` or the Hide button turns it off.
 */
export const isWalletDebugEnabled = (): boolean => {
    // Development tool: never on in production builds.
    if (process.env.NODE_ENV === 'production') return false;
    if (typeof window === 'undefined') return false;
    const flag = new URLSearchParams(window.location.search).get(QUERY_PARAM);
    if (flag === '1' || flag === '0') {
        writeFlag(WALLET_DEBUG_STORAGE_KEY, flag === '1');
        return flag === '1';
    }
    return readFlag(WALLET_DEBUG_STORAGE_KEY);
};

export const clearWalletDebugFlag = (): void => {
    writeFlag(WALLET_DEBUG_STORAGE_KEY, false);
    writeFlag(WALLET_DEBUG_MINIMIZED_KEY, false);
};

/** Whether the overlay is collapsed to its pill; remembered like the flag. */
export const isWalletDebugMinimized = (): boolean =>
    readFlag(WALLET_DEBUG_MINIMIZED_KEY);

export const setWalletDebugMinimized = (minimized: boolean): void =>
    writeFlag(WALLET_DEBUG_MINIMIZED_KEY, minimized);
