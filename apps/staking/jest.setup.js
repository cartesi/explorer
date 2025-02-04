/* eslint-disable no-undef */
//If you need to add more setup options before each test, it's common to add them here.
import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import { TextDecoder, TextEncoder } from 'util';

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
