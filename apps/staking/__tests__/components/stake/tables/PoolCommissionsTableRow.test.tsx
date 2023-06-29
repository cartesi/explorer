// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { render, screen } from '@testing-library/react';
import PoolCommissionsTableRow, {
    PoolCommissionsTableRowProps,
} from '../../../../src/components/stake/tables/PoolCommissionsTableRow';
import commissionsData from '../../../../src/stories/stake/tables/commissionsData';
import {
    StakingPoolFeeHistory,
    StakingPoolFeeType,
} from '../../../../src/graphql/models';
import { Table, Tbody } from '@chakra-ui/react';
import { withChakraTheme } from '../../../test-utilities';
import { format } from '../../../../src/utils/numberFormatter';

const [data] = commissionsData as unknown as StakingPoolFeeHistory[];

const defaultProps = {
    data,
};

const Component: FC<PoolCommissionsTableRowProps> = (props) => (
    <Table>
        <Tbody>
            <PoolCommissionsTableRow {...props} />
        </Tbody>
    </Table>
);

const ThemedComponent =
    withChakraTheme<PoolCommissionsTableRowProps>(Component);

describe('Pool Commissions Table Row', () => {
    const renderComponent = (props) => render(<ThemedComponent {...props} />);

    it('Should have required columns', () => {
        renderComponent(defaultProps);

        expect(screen.getByTestId('timestamp-col')).toBeInTheDocument();
        expect(screen.getByTestId('new-value-col')).toBeInTheDocument();
        expect(screen.getByTestId('percentage-col')).toBeInTheDocument();
    });

    it('Should display timestamp in correct format', () => {
        renderComponent(defaultProps);

        const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
            hourCycle: 'h23',
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        const formattedTimestamp = dateTimeFormat.format(data.timestamp * 1000);

        expect(screen.getByText(formattedTimestamp)).toBeInTheDocument();
    });

    it('Should display change in correct format', () => {
        renderComponent({
            ...defaultProps,
            data: {
                ...defaultProps.data,
                feeType: StakingPoolFeeType.FLAT_RATE,
            },
        });

        const formattedChange = format(data.change / 10000, 'percent', {
            maximumFractionDigits: 2,
            signDisplay: 'exceptZero',
        });

        expect(screen.getByText(formattedChange.join(''))).toBeInTheDocument();
    });
});
