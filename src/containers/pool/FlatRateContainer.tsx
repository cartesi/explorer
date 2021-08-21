// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import CommissionForm from '../../components/pools/fee/CommissionForm';
import TransactionFeedback from '../../components/TransactionFeedback';
import { useFlatRateCommission } from '../../services/pool';

export interface FlatRateContainerProps {
    pool: string;
}

const FlatRateContainer: FC<FlatRateContainerProps> = (props) => {
    const { pool } = props;
    const {
        rate,
        maxRaise,
        timeoutTimestamp,
        raiseTimeout,
        changeRate,
        transaction,
    } = useFlatRateCommission(pool);

    return (
        <>
            <TransactionFeedback transaction={transaction} />
            <CommissionForm
                currentValue={rate?.toNumber() / 100}
                unit="%"
                min={0}
                max={100}
                maxDigits={2}
                increaseWaitPeriod={raiseTimeout?.toNumber()}
                nextIncrease={timeoutTimestamp}
                maxRaise={maxRaise?.toNumber()}
                onSubmit={(value) => changeRate(value * 100)}
                helperText="Commission is set as a fixed percentage of every block reward (CTSI)"
            />
        </>
    );
};

export default FlatRateContainer;
