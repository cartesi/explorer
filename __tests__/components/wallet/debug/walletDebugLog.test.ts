// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    describeError,
    getWalletDebugEntries,
    installWalletDebugCapture,
} from '../../../../src/components/wallet/debug/walletDebugLog';

const lastEntry = () => getWalletDebugEntries().at(-1);

describe('describeError', () => {
    it('formats errors with their name, message and code', () => {
        expect(describeError(new Error('boom'))).toBe('Error: boom');
        expect(
            describeError(Object.assign(new Error('nope'), { code: 4001 })),
        ).toBe('Error: nope (code 4001)');
        expect(describeError('plain')).toBe('plain');
    });
});

describe('wallet debug log', () => {
    let errorSpy: jest.SpyInstance;
    let warnSpy: jest.SpyInstance;
    let uninstall: () => void;

    beforeEach(() => {
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        uninstall = installWalletDebugCapture();
    });

    afterEach(() => {
        uninstall();
        jest.restoreAllMocks();
    });

    it('captures console errors and warnings and still forwards them', () => {
        console.error('boom', new Error('detail'));
        console.warn('careful', { code: 4001 });

        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(getWalletDebugEntries().slice(-2)).toMatchObject([
            { kind: 'console.error', message: 'boom Error: detail' },
            { kind: 'console.warn', message: 'careful {"code":4001}' },
        ]);
    });

    it('captures window errors and unhandled rejections', () => {
        window.dispatchEvent(
            new ErrorEvent('error', { message: 'window boom' }),
        );
        expect(lastEntry()).toMatchObject({
            kind: 'window.error',
            message: 'window boom',
        });

        const rejection = new Event('unhandledrejection');
        Object.assign(rejection, { reason: new Error('nope') });
        window.dispatchEvent(rejection);
        expect(lastEntry()).toMatchObject({
            kind: 'unhandledrejection',
            message: 'Error: nope',
        });
    });

    it('keeps the last twenty entries', () => {
        for (let i = 0; i < 25; i++) console.warn(`entry ${i}`);

        const entries = getWalletDebugEntries();
        expect(entries).toHaveLength(20);
        expect(entries[0].message).toBe('entry 5');
        expect(entries[19].message).toBe('entry 24');
    });

    it('installs only once and restores the console on uninstall', () => {
        expect(installWalletDebugCapture()).toBe(uninstall);

        uninstall();
        console.warn('after uninstall');

        expect(lastEntry()?.message).not.toBe('after uninstall');
        expect(warnSpy).toHaveBeenCalledWith('after uninstall');
        uninstall = installWalletDebugCapture();
    });
});
