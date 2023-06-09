// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, renderHook } from '@testing-library/react';
import { useQuery } from '@apollo/client';
import useBlocks from '../../../src/graphql/hooks/useBlocks';
import { BLOCKS } from '../../../src/graphql/queries';

jest.mock('@apollo/client', () => {
    const original = jest.requireActual('@apollo/client');
    return {
        __esModule: true,
        ...original,
        useQuery: jest.fn(),
    };
});

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useBlocks hook', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should invoke useQuery hook with correct default params', () => {
        const implementation = jest.fn();
        mockedUseQuery.mockImplementation(implementation);

        renderHook(() => useBlocks());

        expect(implementation).toHaveBeenCalledWith(BLOCKS, {
            variables: {
                count: 100,
                skip: 0,
                where: {
                    producer: undefined,
                    node: undefined,
                },
            },
            pollInterval: 30000,
            notifyOnNetworkStatusChange: true,
        });
    });

    it('should invoke useQuery hook with correct params', () => {
        const implementation = jest.fn();
        mockedUseQuery.mockImplementation(implementation);

        const where = {
            producer: '0x9a50ecec41fd63f5a02522ddb3da7319a6a30276',
            node: '0x9a50ecec41fd63f5a02522ddb3da7319a6a30276',
        };
        const count = 200;
        renderHook(() => useBlocks(where, count));

        expect(implementation).toHaveBeenCalledWith(BLOCKS, {
            variables: {
                where: {
                    producer: where.node.toLowerCase(),
                    node: where.producer.toLowerCase(),
                },
                skip: 0,
                count,
            },
            pollInterval: 30000,
            notifyOnNetworkStatusChange: true,
        });
    });
});
