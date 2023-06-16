// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, render, screen } from '@testing-library/react';
import { useClipboard } from '@chakra-ui/react';
import Address, { AddressProps } from '../../src/components/Address';
import { ENSEntry, useENS } from '@explorer/services/src/ens';
import { withChakraTheme } from '../test-utilities';
import { StakePlusIcon } from '../../src/components/Icons';

jest.mock('@explorer/services/src/ens', () => {
    const original = jest.requireActual('@explorer/services');
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
    address: '0x938438004d764b81a6d5322828d36db856cef2ef',
};
const defaultUseClipboardProps = {
    value: '',
    hasCopied: false,
    onCopy: () => undefined,
};
const Component = withChakraTheme<AddressProps>(Address);
const mockUseENS = useENS as jest.MockedFunction<typeof useENS>;
const mockUseClipboard = useClipboard as jest.MockedFunction<
    typeof useClipboard
>;

describe('Address component', () => {
    const renderComponent = (props = {}) =>
        render(<Component {...defaultProps} {...props} />);

    beforeEach(() => {
        mockUseENS.mockReturnValue({} as ENSEntry);
        mockUseClipboard.mockReturnValue(defaultUseClipboardProps);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should display address', () => {
        renderComponent();
        expect(screen.getByText(defaultProps.address)).toBeInTheDocument();
    });

    it('should show actions', () => {
        renderComponent({
            hideActions: false,
        });
        expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
        expect(screen.getByTestId('external-link-icon')).toBeInTheDocument();
    });

    it('should display copied label', async () => {
        mockUseClipboard.mockReturnValue({
            ...defaultUseClipboardProps,
            hasCopied: true,
        });
        renderComponent({
            hideActions: false,
        });

        expect(screen.getByText('Copied')).toBeInTheDocument();
    });

    it('should display custom fallback avatar', () => {
        renderComponent({
            shouldDisplayFallbackAvatar: true,
            fallbackAvatar: StakePlusIcon,
        });

        expect(screen.getByTestId('fallback-avatar')).toBeInTheDocument();
    });
});
