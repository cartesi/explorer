// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { createClient } from 'urql';
import { Network } from '@explorer/utils';
import { withChakraTheme } from '../../test-utilities';
import GraphQLProvider, {
    urls,
} from '../../../src/containers/rollups/GraphQLProvider';

jest.mock('urql', () => {
    const originalModule = jest.requireActual('urql');
    return {
        __esModule: true,
        ...originalModule,
        createClient: jest.fn(),
    };
});

const mockCreateClient = createClient as jest.MockedFunction<
    typeof createClient
>;

const Component = withChakraTheme(GraphQLProvider);
const props = {
    chainId: Network.GOERLI,
};

describe('GraphQLProvider container', () => {
    it('should invoke createClient with correct params', async () => {
        const mockedCreateClient = jest.fn();
        mockCreateClient.mockImplementationOnce(mockedCreateClient);
        render(<Component {...props} />);

        expect(mockedCreateClient).toHaveBeenCalledWith({
            url: urls[props.chainId],
        });
    });

    it('should not invoke createClient', async () => {
        const mockedCreateClient = jest.fn();
        mockCreateClient.mockImplementationOnce(mockedCreateClient);
        render(<Component {...props} chainId={undefined} />);

        expect(mockedCreateClient.mock.calls.length).toBe(0);
    });

    it('should display children', () => {
        const text = 'Test ABC';
        render(<Component {...props}>{text}</Component>);

        expect(screen.getByText(text)).toBeInTheDocument();
    });
});
