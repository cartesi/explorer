// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { NodeAllowanceSection } from '../../../src/components/node/NodeAllowanceSection';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(NodeAllowanceSection);

describe('NodeAllowanceSection component', () => {
    it('should invoke onAllowanceClick callback when icon button is clicked', () => {
        const mockedOnAllowanceClick = jest.fn();
        const { container } = render(
            <Component
                allowance={BigNumber.from('10000')}
                onAllowanceClick={mockedOnAllowanceClick}
            />
        );

        const button = container.querySelector('button');
        fireEvent.click(button);

        expect(mockedOnAllowanceClick).toHaveBeenCalled();
    });
});
