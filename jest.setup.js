/* eslint-disable no-undef */
//If you need to add more setup options before each test, it's common to add them here.
import '@testing-library/jest-dom/extend-expect';

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
