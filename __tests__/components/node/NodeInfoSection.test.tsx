// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { useMediaQuery } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { useFlag } from '@unleash/proxy-client-react';
import { BigNumber } from 'ethers';
import { NodeInfoSection } from '../../../src/components/node/NodeInfoSection';
import { useUserNodes } from '../../../src/graphql/hooks/useNodes';
import { truncateString } from '../../../src/utils/stringUtils';
import { buildUseUserNodesReturn } from '../../containers/mocks';

const NODE_BALANCE_ETH = '0.1868';
const defaultProps = {
    account: '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4',
    address: '0xb00299b573a9deee20e6a242416188d1033e325f',
    userBalance: BigNumber.from('0x029799b68c5fbbd4'),
    nodeBalance: BigNumber.from('0x029799b68c5fbbd4'),
    onRetire: null,
    onHire: null,
    onDeposit: null,
    onAuthorize: null,
};
jest.mock('../../../src/graphql/hooks/useNodes');

jest.mock('@unleash/proxy-client-react', () => {
    const original = jest.requireActual('@unleash/proxy-client-react');
    return {
        __esModule: true,
        ...original,
        useFlag: jest.fn(),
    };
});

jest.mock('@chakra-ui/react', () => {
    const originalModule = jest.requireActual('@chakra-ui/react');
    return {
        __esModule: true,
        ...originalModule,
        useMediaQuery: jest.fn(),
    };
});

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<
    typeof useMediaQuery
>;
const useUserNodeStub = useUserNodes as jest.MockedFunction<
    typeof useUserNodes
>;

const useFlagStub = useFlag as jest.MockedFunction<typeof useFlag>;

describe('NodeInfoSection component', () => {
    beforeEach(() => {
        mockUseMediaQuery.mockReturnValue([true]);
        useUserNodeStub.mockReturnValue(buildUseUserNodesReturn());
        useFlagStub.mockReturnValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should render proper values', () => {
        render(<NodeInfoSection {...defaultProps} />);

        expect(screen.getByText(NODE_BALANCE_ETH)).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Hired')).toBeInTheDocument();
    });

    it('Should render full address', () => {
        mockUseMediaQuery.mockReturnValue([true]);
        render(<NodeInfoSection {...defaultProps} />);

        expect(screen.getByText(defaultProps.address)).toBeInTheDocument();
    });

    it('Should render truncated address', () => {
        mockUseMediaQuery.mockReturnValue([false]);
        render(<NodeInfoSection {...defaultProps} />);
        expect(
            screen.getByText(truncateString(defaultProps.address))
        ).toBeInTheDocument();
    });

    it('should render node hire form', () => {
        render(<NodeInfoSection {...defaultProps} isRetired />);

        expect(screen.getByText('Hire node')).toBeInTheDocument();
    });

    it('should disable edit balance button while retiring', () => {
        render(<NodeInfoSection {...defaultProps} isRetiring />);

        const editBalanceButton = screen.getByTestId('edit-balance-button');
        expect(editBalanceButton.hasAttribute('disabled')).toBe(true);
    });

    it('should enable edit balance button when not retiring', () => {
        render(<NodeInfoSection {...defaultProps} isRetiring={false} />);

        const editBalanceButton = screen.getByTestId('edit-balance-button');
        expect(editBalanceButton.hasAttribute('disabled')).toBe(false);
    });

    it('should disable retire node button while retiring', () => {
        render(<NodeInfoSection {...defaultProps} isRetiring />);

        const retireNodeButton = screen
            .getByText('Retire node')
            .closest('button');
        expect(retireNodeButton.hasAttribute('disabled')).toBe(true);
    });

    it('should enable retire node button when not retiring', () => {
        render(<NodeInfoSection {...defaultProps} isRetiring={false} />);

        const retireNodeButton = screen
            .getByText('Retire node')
            .closest('button');
        expect(retireNodeButton.hasAttribute('disabled')).toBe(false);
    });

    it('should display Authorize button when node is not authorized to interact with PoS contract', () => {
        render(
            <NodeInfoSection
                {...defaultProps}
                isAuthorized={false}
                onAuthorize={jest.fn()}
            />
        );

        expect(screen.getByText('Authorize')).toBeInTheDocument();
    });

    it('should while authorizing disable the button and display a loading text', () => {
        render(
            <NodeInfoSection
                {...defaultProps}
                isAuthorizing
                isAuthorized={false}
            />
        );

        const btn = screen.getByText('authorizing').closest('button');

        expect(btn.hasAttribute('disabled')).toBe(true);
    });
});
