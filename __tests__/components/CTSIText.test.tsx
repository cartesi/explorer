// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Icon, Text } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { FaIcons } from 'react-icons/fa';
import CTSIText from '../../src/components/CTSIText';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(CTSIText);

describe('CTSI Text component', () => {
    it('Should render the formatted amount of CTSI', () => {
        render(<Component value="5000100000000000000000000" />);

        expect(screen.getByText('5,000,100')).toBeInTheDocument();
    });

    it('Should render the text and the formatted CTSI amount', () => {
        render(
            <Component
                value="5000100000000000000000000"
                options={{ maximumFractionDigits: 2 }}
            >
                <Text>Wallet Balance</Text>
            </Component>
        );

        expect(screen.getByText('Wallet Balance')).toBeInTheDocument();
        expect(screen.getByText('5,000,100')).toBeInTheDocument();
        expect(screen.getByText('CTSI')).toBeInTheDocument();
    });

    it('Should render an icon with the formatted CTSI amount', () => {
        const { container } = render(
            <Component
                value="5000100000000000000000000"
                options={{ maximumFractionDigits: 2 }}
                icon={<Icon as={FaIcons} />}
            >
                <Text>Staked Balance</Text>
            </Component>
        );
        expect(container.querySelector('svg > path')).toBeInTheDocument();
        expect(screen.getByText('Staked Balance')).toBeInTheDocument();
        expect(screen.getByText('5,000,100')).toBeInTheDocument();
        expect(screen.getByText('CTSI')).toBeInTheDocument();
    });
});
