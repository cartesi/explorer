// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

/**
 * Keeps the last console errors and warnings for the wallet debug overlay, so
 * errors thrown before the overlay mounts (during reconnect) are still shown.
 */

export interface WalletDebugEntry {
    at: string;
    kind:
        | 'console.error'
        | 'console.warn'
        | 'window.error'
        | 'unhandledrejection';
    message: string;
}

const MAX_ENTRIES = 20;

let entries: WalletDebugEntry[] = [];
let uninstall: (() => void) | undefined;

/** `Name: message (code N)` for errors, the string itself otherwise. */
export const describeError = (error: unknown): string => {
    if (error instanceof Error) {
        const { code } = error as { code?: unknown };
        const suffix = code === undefined ? '' : ` (code ${String(code)})`;
        return `${error.name}: ${error.message}${suffix}`;
    }
    return String(error);
};

const formatArg = (arg: unknown): string => {
    if (arg instanceof Error || typeof arg === 'string') {
        return describeError(arg);
    }
    try {
        return JSON.stringify(arg);
    } catch {
        return String(arg);
    }
};

const push = (kind: WalletDebugEntry['kind'], args: unknown[]): void => {
    entries = [
        ...entries,
        {
            at: new Date().toISOString(),
            kind,
            message: args.map(formatArg).join(' '),
        },
    ].slice(-MAX_ENTRIES);
};

/** Idempotent; returns the uninstall function. */
export const installWalletDebugCapture = (): (() => void) => {
    if (uninstall) return uninstall;
    const originals = { error: console.error, warn: console.warn };
    (['error', 'warn'] as const).forEach((level) => {
        console[level] = (...args: unknown[]) => {
            originals[level](...args);
            push(`console.${level}`, args);
        };
    });
    const onError = (event: ErrorEvent) =>
        push('window.error', [event.message ?? event.error]);
    const onRejection = (event: PromiseRejectionEvent) =>
        push('unhandledrejection', [event.reason]);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    uninstall = () => {
        Object.assign(console, originals);
        window.removeEventListener('error', onError);
        window.removeEventListener('unhandledrejection', onRejection);
        uninstall = undefined;
    };
    return uninstall;
};

export const getWalletDebugEntries = (): WalletDebugEntry[] => entries;
