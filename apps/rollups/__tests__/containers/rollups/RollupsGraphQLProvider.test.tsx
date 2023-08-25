// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from '@testing-library/react';
import { Client } from 'urql';
import GraphQLProvider from '../../../src/containers/rollups/RollupsGraphQLProvider';
import { Network, useNetwork } from '../../../src/services/useNetwork';
import { useRollupsGraphQL } from '../../../src/services/useRollupsGraphQL';
import { withChakraTheme } from '../../test-utilities';

jest.mock('urql', () => {
    const originalModule = jest.requireActual('urql');
    return {
        __esModule: true,
        ...originalModule,
        Provider: ({ children }) => (
            <div data-testid="provider">{children}</div>
        ),
    };
});

jest.mock('../../../src/services/useNetwork', () => {
    const originalModule = jest.requireActual(
        '../../../src/services/useNetwork'
    );
    return {
        __esModule: true,
        ...originalModule,
        useNetwork: jest.fn(),
    };
});

jest.mock('../../../src/services/useRollupsGraphQL', () => {
    const originalModule = jest.requireActual(
        '../../../src/services/useRollupsGraphQL'
    );
    return {
        __esModule: true,
        ...originalModule,
        useRollupsGraphQL: jest.fn(),
    };
});

const mockUseRollupsGraphQL = useRollupsGraphQL as jest.MockedFunction<
    typeof useRollupsGraphQL
>;

const mockUseNetwork = useNetwork as jest.MockedFunction<typeof useNetwork>;

const Component = withChakraTheme(GraphQLProvider);

const defaultProps = {
    address: '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad',
    chainId: 11155111,
};

describe('GraphQLProvider container', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should set correct address and url when changing url', () => {
        mockUseNetwork.mockReturnValue({} as Network);
        mockUseRollupsGraphQL.mockReturnValue({} as Client);
        const mockedUseRollupsGraphQL = jest.fn();

        const { container } = render(<Component {...defaultProps} />);
        mockUseRollupsGraphQL.mockImplementation(mockedUseRollupsGraphQL);

        const url = 'https://google.com';
        const input = container.querySelector('input');

        act(() => {
            fireEvent.change(input, {
                target: {
                    value: url,
                },
            });
        });

        expect(mockedUseRollupsGraphQL).toBeCalledWith(
            defaultProps.address,
            url
        );
    });

    it('should display content when client is available', () => {
        mockUseNetwork.mockReturnValue(undefined);
        mockUseRollupsGraphQL.mockReturnValue({} as Client);

        render(<Component {...defaultProps} />);
        expect(screen.getByTestId('provider')).toBeInTheDocument();
    });

    it('should not display content when client is not available', () => {
        mockUseNetwork.mockReturnValue(undefined);
        mockUseRollupsGraphQL.mockReturnValue(undefined);

        render(<Component {...defaultProps} />);
        expect(() => screen.getByTestId('provider')).toThrow(
            'Unable to find an element'
        );
    });
});
