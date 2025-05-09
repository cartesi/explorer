// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen } from '@testing-library/react';
import { NodeRetiredHistory } from '../../../src/components/node/NodeRetiredHistory';
import {
    buildUseUserNodesReturn,
    nodeRetiredHistoryData,
} from '../../containers/mocks';
import { useUserNodes } from '../../../src/graphql/hooks/useNodes';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(NodeRetiredHistory);

jest.mock('../../../src/graphql/hooks/useNodes');
const useUserNodeStub = useUserNodes as jest.MockedFunction<
    typeof useUserNodes
>;
const ADDRESS = '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4';
const defaultProps = {
    address: ADDRESS,
};
const renderComponent = () => render(<Component {...defaultProps} />);
describe('Node Retired History', () => {
    beforeEach(() => {
        useUserNodeStub.mockReturnValue(buildUseUserNodesReturn());
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should display the title', () => {
        renderComponent();
        const title = screen.getAllByText('Node History')[0];
        expect(title).toBeInTheDocument();
    });

    it('Should open the accordion', () => {
        renderComponent();
        fireEvent.click(screen.getByText('Node History'));
        expect(screen.getByText('Node Address')).toBeInTheDocument();
        expect(
            screen.getByText('Retire Date', { exact: false })
        ).toBeInTheDocument();
    });
});

describe('When user has no retired node', () => {
    beforeEach(() => {
        useUserNodeStub.mockReturnValue(buildUseUserNodesReturn());
    });
    const userNodes = buildUseUserNodesReturn();
    userNodes.data = { nodes: [] };
    useUserNodeStub.mockReturnValue(userNodes);
    it('Should not display anything', () => {
        renderComponent();
        fireEvent.click(screen.getByText('Node History'));
        const nodeAddress = screen.queryByText(
            '0x43551627aafca2f871d4b23d438257b8fcf741d6'
        );
        expect(nodeAddress).not.toBeInTheDocument();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});

describe('When user has retired node', () => {
    beforeEach(() => {
        const userNodes = buildUseUserNodesReturn();
        userNodes.data = nodeRetiredHistoryData().data;
        useUserNodeStub.mockReturnValue(userNodes);
    });

    it('Should display the node address', () => {
        renderComponent();
        fireEvent.click(screen.getByText('Node History'));
        const { container } = render(<Component {...defaultProps} />);
        const tbody = container.querySelectorAll('.chakra-table tbody');
        expect(tbody.length).toBe(1);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
