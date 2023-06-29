// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import SyncStatus from '../../src/components/SyncStatus';
import { withChakraTheme } from '../test-utilities';
import { useBlockNumber } from '../../src/services/eth';
import useMeta from '../../src/graphql/hooks/useMeta';

const blockNumberMod = '../../src/services/eth';
jest.mock(blockNumberMod, () => {
    const originalModule = jest.requireActual(blockNumberMod);
    return {
        __esModule: true,
        ...originalModule,
        useBlockNumber: jest.fn(),
    };
});
jest.mock('../../src/graphql/hooks/useMeta');

const mockUseBlockNumber = useBlockNumber as jest.MockedFunction<
    typeof useBlockNumber
>;
const mockUseMeta = useMeta as jest.MockedFunction<typeof useMeta>;
const Component = withChakraTheme(SyncStatus);

const blockNumber = 1;
const metaData = {
    block: {
        hash: '0x6200d8606aab695a7f730a3f7c60e399eb3bd10f',
        number: 1,
    },
    deployment: '1',
    hasIndexingErrors: false,
};

describe('SyncStatus component', () => {
    beforeEach(() => {
        mockUseBlockNumber.mockReturnValue(blockNumber);
        mockUseMeta.mockReturnValue(metaData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should not display anything if no issues occurred', () => {
        render(<Component />);
        expect(() => screen.getByText('Synchronization delay')).toThrow(
            'Unable to find an element'
        );
    });

    it('should display correct title', () => {
        mockUseMeta.mockReturnValue({
            ...metaData,
            hasIndexingErrors: true,
        });
        const { rerender } = render(<Component />);
        expect(screen.getByText('Indexing errors')).toBeInTheDocument();

        mockUseMeta.mockReturnValue({
            ...metaData,
            block: {
                ...metaData.block,
                number: 100,
            },
        });
        rerender(<Component />);
        expect(screen.getByText('Synchronization delay')).toBeInTheDocument();
    });

    it('should display correct alert description', () => {
        const mockedBlockNumber = 10;
        mockUseBlockNumber.mockReturnValue(mockedBlockNumber);
        mockUseMeta.mockReturnValue({
            ...metaData,
            hasIndexingErrors: true,
        });
        render(<Component />);
        expect(
            screen.getByText(
                `Synchronization issue between backend data and blockchain data. Backend data delayed by ${
                    mockedBlockNumber - metaData.block.number
                } blocks.`
            )
        ).toBeInTheDocument();
    });
});
