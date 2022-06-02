// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { NodeMaturingSection } from '../../../src/components/node/NodeMaturingSection';
import { BigNumber } from 'ethers';

const TEST_MATURING_BALANCE = BigNumber.from('0x04b75e170de2fc0000');
const TEST_MATURING_BALANCE_CTSI = '87';
const TEST_MATURING_TIME = '1 hour, 20 minutes';

describe('NodeMaturingSection component', () => {
    afterEach(() => cleanup());

    it('Should be with 0 CTSI, 6 hours', () => {
        render(<NodeMaturingSection maturingBalance={BigNumber.from(0)} />);

        expect(
            screen.getByText(
                'The staking will take 6 hours to be ready. Each new stake will restart the waiting time.'
            )
        ).toBeInTheDocument();

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it(`Should be with ${TEST_MATURING_BALANCE_CTSI} CTSI, ${TEST_MATURING_TIME}`, () => {
        render(
            <NodeMaturingSection
                maturingBalance={TEST_MATURING_BALANCE}
                maturingLeft={TEST_MATURING_TIME}
            />
        );

        expect(
            screen.getByText(
                'The staking will take 1 hour, 20 minutes to be ready. Each new stake will restart the waiting time.'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(TEST_MATURING_BALANCE_CTSI)
        ).toBeInTheDocument();
    });
});
