//If you need to add more setup options before each test, it's common to add them here.
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import 'cross-fetch/polyfill';
import { TextDecoder, TextEncoder } from 'util';

process.env.ENS_ENTRIES_PER_REQ_LIMIT = 2;
process.env.TURSO_DATABASE_URL = 'file:local-test.db';

Object.assign(global, { TextEncoder, TextDecoder });

jest.mock('./src/services/ens', () => {
    const original = jest.requireActual('./src/services/ens');
    return {
        __esModule: true,
        ...original,
        useENS: jest.fn().mockImplementation((address) => ({
            address,
            resolving: false,
        })),
    };
});

// The wallet hook is the only module importing wagmi and RainbowKit (ESM-only,
// heavy). Stub it everywhere; tests that exercise it unmock the module.
jest.mock('./src/components/wallet/useWagmiWallet', () => ({
    __esModule: true,
    useWagmiWallet: jest.fn(() => ({
        active: false,
        connectWallet: jest.fn(),
        disconnectWallet: jest.fn(),
    })),
}));

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Object.defineProperty(window, 'scrollTo', {
    writable: false,
    value: jest.fn().mockImplementation(() => undefined),
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
