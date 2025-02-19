// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { NodeReleasingSection } from '../../../src/components/node/NodeReleasingSection';

const TEST_RELEASING_BALANCE = BigNumber.from('0x04b75e170de2fc0000');
const TEST_RELEASING_BALANCE_CTSI = '87';
const TEST_RELEASING_TIME = '1 hour, 20 minutes';
const TEST_WITHDRAW_BUTTON = `WITHDRAW (${TEST_RELEASING_TIME})`;

describe('NodeReleasingSection component', () => {
    it(`Should be 'Releasing' with ${TEST_RELEASING_BALANCE} CTSI, ${TEST_RELEASING_TIME}`, () => {
        render(
            <NodeReleasingSection
                releasingBalance={TEST_RELEASING_BALANCE}
                releasingLeftShort={TEST_RELEASING_TIME}
                onWithdraw={null}
            />
        );

        expect(
            screen.getByText('Your funds take 48 hours to become unblocked.')
        ).toBeInTheDocument();

        expect(screen.getByText('Releasing')).toBeInTheDocument();
        expect(
            screen.getByText(TEST_RELEASING_BALANCE_CTSI)
        ).toBeInTheDocument();

        expect(screen.getByText(TEST_WITHDRAW_BUTTON)).toBeInTheDocument();
    });

    it(`Should be 'Released' with ${TEST_RELEASING_BALANCE_CTSI} CTSI, no Withdraw time text`, () => {
        render(
            <NodeReleasingSection
                releasingBalance={TEST_RELEASING_BALANCE}
                releasingLeftShort={null}
                onWithdraw={null}
            />
        );

        expect(
            screen.getByText('Your funds take 48 hours to become unblocked.')
        ).toBeInTheDocument();

        expect(screen.getByText('Released')).toBeInTheDocument();
        expect(
            screen.getByText(TEST_RELEASING_BALANCE_CTSI)
        ).toBeInTheDocument();

        expect(screen.getByText('WITHDRAW')).toBeInTheDocument();
    });

    it(`Should be 'Released' with 0 CTSI, no Withdraw button`, () => {
        render(
            <NodeReleasingSection
                releasingBalance={BigNumber.from('0')}
                releasingLeftShort={null}
                onWithdraw={null}
            />
        );

        expect(
            screen.getByText('Your funds take 48 hours to become unblocked.')
        ).toBeInTheDocument();

        expect(screen.getByText('Released')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();

        expect(screen.queryByText('WITHDRAW')).not.toBeInTheDocument();
    });
});
