// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Table } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { useFlag } from '@unleash/proxy-client-react';
import { FC } from 'react';
import PoolPerformanceTableRow, {
    PoolPerformanceTableRowProps,
} from '../../../../src/components/stake/tables/PoolPerformanceTableRow';
import { StakingPool } from '../../../../src/graphql/models';
import stakingPoolsData, {
    stakingPoolWithPerformance,
} from '../../../stubs/stakingPoolsData';
import { withChakraTheme } from '../../../test-utilities';

jest.mock('next/link', () => ({ children, ...props }) => {
    const { passHref, ...restProps } = props;
    return <div {...restProps}>{children}</div>;
});

jest.mock('@unleash/proxy-client-react', () => ({
    useFlag: jest.fn(),
}));

const useFlagMock = useFlag as jest.MockedFunction<typeof useFlag>;

const [pool] = stakingPoolsData as unknown as StakingPool[];

const defaultProps = {
    account: '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6',
    chainId: 5,
    pool,
};

const Component: FC<PoolPerformanceTableRowProps> = (props) => (
    <Table.Root>
        <Table.Body>
            <PoolPerformanceTableRow {...props} />
        </Table.Body>
    </Table.Root>
);

const ThemedComponent =
    withChakraTheme<PoolPerformanceTableRowProps>(Component);

describe('Pool Performance Table Row', () => {
    const renderComponent = (props) => render(<ThemedComponent {...props} />);

    beforeEach(() => {
        useFlagMock.mockReturnValue(false);
    });

    it('Should have required columns', () => {
        renderComponent(defaultProps);

        expect(screen.getByTestId('address-col')).toBeInTheDocument();
        expect(screen.getByTestId('total-users-col')).toBeInTheDocument();
        expect(screen.getByTestId('total-reward-col')).toBeInTheDocument();
        expect(screen.getByTestId('commission-col')).toBeInTheDocument();
        expect(
            screen.getByTestId('accrued-commission-col')
        ).toBeInTheDocument();
        expect(screen.getByTestId('stake-info-col')).toBeInTheDocument();
    });

    it('should have href to stake info page', () => {
        renderComponent(defaultProps);

        const stakeInfoLink = screen.getByTestId('stake-info-link');
        expect(stakeInfoLink.getAttribute('href')).toBe(`/stake/${pool.id}`);
    });

    it('should not display manage button when account is different from pool manager', () => {
        renderComponent({
            ...defaultProps,
            account: '19283091820',
        });
        expect(() => screen.getByText('Manage')).toThrow(
            'Unable to find an element'
        );
    });

    it('should display paused tooltip when pool is paused', () => {
        renderComponent({
            ...defaultProps,
            pool: {
                ...defaultProps.pool,
                paused: true,
            },
        });

        expect(screen.getByTestId('paused-tooltip-icon')).toBeInTheDocument();
    });

    it('should not display paused tooltip when pool is not paused', () => {
        renderComponent({
            ...defaultProps,
            pool: {
                ...defaultProps.pool,
                paused: false,
            },
        });

        expect(() => screen.getByTestId('paused-tooltip-icon')).toThrow(
            'Unable to find an element'
        );
    });

    describe('When using newPerformanceEnabled on', () => {
        beforeEach(() => {
            useFlagMock.mockReturnValue(true);
        });

        it('it should render two new columns for monthly and weekly performance', async () => {
            renderComponent({
                ...defaultProps,
                pool: stakingPoolWithPerformance,
            });

            expect(
                screen.getByTestId('week-performance-col')
            ).toBeInTheDocument();
            expect(
                screen.getByTestId('month-performance-col')
            ).toBeInTheDocument();
        });
    });
});
