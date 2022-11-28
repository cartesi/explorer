// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import CommissionForm from '../../components/stake/CommissionForm';
import { useFlatRateCommission } from '../../services/pool';
import TransactionBanner from '../../components/TransactionBanner';
import { AlertMessage } from '../../components/stake/TransactionInfoBanner';

export interface FlatRateContainerProps {
    pool: string;
    alertMessage: AlertMessage;
}

const FlatRateContainer: FC<FlatRateContainerProps> = (props) => {
    const { pool, alertMessage } = props;
    const {
        rate,
        maxRaise,
        timeoutTimestamp,
        raiseTimeout,
        changeRate,
        transaction,
    } = useFlatRateCommission(pool);
    const progress = transaction?.receipt?.confirmations || 0;

    return (
        <>
            <TransactionBanner
                {...alertMessage}
                transaction={transaction}
                mb={2}
            />

            <CommissionForm
                currentValue={rate ? rate?.toNumber() / 100 : 0}
                unit="%"
                min={0}
                max={100}
                maxDigits={2}
                increaseWaitPeriod={raiseTimeout?.toNumber()}
                nextIncrease={timeoutTimestamp}
                maxRaise={maxRaise?.toNumber() / 100}
                progress={progress}
                helperText="Commission is set as a fixed percentage of every block reward (CTSI)"
                onSubmit={(value) => changeRate(value * 100)}
            />
        </>
    );
};

export default FlatRateContainer;
