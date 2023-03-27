// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { withChakraTheme } from '../test-utilities';
import DAppCard from '../../src/components/DAppCard';

jest.mock('next/router', () => {
    const originalModule = jest.requireActual('next/router');
    return {
        __esModule: true,
        ...originalModule,
        useRouter: jest.fn(),
    };
});

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const Component = withChakraTheme(DAppCard);

const defaultProps = {
    address: '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad',
    inputCount: 10,
    chainId: 5,
    date: new Date(),
};

describe('DAppsCard component', () => {
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('should render correct subtitle', () => {
        render(<Component {...defaultProps} />);

        const subtitle = screen.getByTestId('card-subtitle');
        expect(subtitle.innerHTML).toBe(
            `${
                defaultProps.inputCount
            } inputs since ${defaultProps.date.toDateString()}`
        );
    });

    it('should redirect to correct dapp route', () => {
        const mockedPush = jest.fn();
        mockUseRouter.mockReturnValue({
            push: mockedPush,
        } as unknown as NextRouter);

        render(<Component {...defaultProps} />);

        const button = screen.getByTestId('card-action-button');
        fireEvent.click(button);
        expect(mockedPush).toBeCalledWith(`/dapp/${defaultProps.address}`);
    });

    it('should render Address component as title', () => {
        render(<Component {...defaultProps} />);
        expect(screen.getByTestId('address')).toBeInTheDocument();
    });
});
