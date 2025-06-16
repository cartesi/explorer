// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useClipboard } from '@chakra-ui/react';
import { cleanup, render, screen } from '@testing-library/react';
import { TbCoins } from 'react-icons/tb';

import AddressText from '../../src/components/AddressText';
import { ENSEntry, useENS } from '../../src/services/ens';
import { withChakraTheme } from '../test-utilities';

const ensModule = '../../src/services/ens';

jest.mock(ensModule, () => {
    const original = jest.requireActual(ensModule);
    return {
        __esModule: true,
        ...original,
        useENS: jest.fn(),
    };
});

jest.mock('@chakra-ui/react', () => {
    const original = jest.requireActual('@chakra-ui/react');
    return {
        __esModule: true,
        ...original,
        useClipboard: jest.fn(),
    };
});

const defaultProps = {
    chainId: 5,
    address: '0x938438004d764b81a6d5322828d36db856cef2ef',
};
const defaultUseClipboardProps = {
    value: '',
    hasCopied: false,
    onCopy: () => undefined,
    setValue: jest.fn(),
};
const Component = withChakraTheme(AddressText);
const mockUseENS = useENS as jest.MockedFunction<typeof useENS>;
const mockUseClipboard = useClipboard as jest.MockedFunction<
    typeof useClipboard
>;

describe('AddressText component', () => {
    const renderComponent = (props = {}) =>
        render(<Component {...defaultProps} {...props} />);

    beforeEach(() => {
        mockUseENS.mockReturnValue({} as ENSEntry);
        mockUseClipboard.mockReturnValue(defaultUseClipboardProps as any);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should display address', () => {
        renderComponent();
        expect(screen.getByTestId('address')).toBeInTheDocument();
    });

    it('should not display address', () => {
        renderComponent({
            address: undefined,
        });

        expect(() => screen.getByTestId('address')).toThrow(
            'Unable to find an element'
        );
    });

    it('should display icon', () => {
        renderComponent({
            icon: TbCoins,
        });

        expect(screen.getByTestId('address-text-icon')).toBeInTheDocument();
    });

    it('should not display icon', () => {
        renderComponent();

        expect(() => screen.getByTestId('address-text-icon')).toThrow(
            'Unable to find an element'
        );
    });
});
