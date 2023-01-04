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
import { useGasTaxCommission } from '../../services/pool';
import TransactionBanner from '../../components/TransactionBanner';
import { AlertMessage } from '../../components/stake/TransactionInfoBanner';

export interface GasTaxContainerProps {
    pool: string;
    alertMessage: AlertMessage;
}

const GasTaxContainer: FC<GasTaxContainerProps> = (props) => {
    const { pool, alertMessage } = props;
    const {
        gas,
        maxRaise,
        timeoutTimestamp,
        raiseTimeout,
        changeGas,
        transaction,
    } = useGasTaxCommission(pool);
    const progress = transaction?.receipt?.confirmations || 0;

    return (
        <>
            <TransactionBanner
                {...alertMessage}
                transaction={transaction}
                mb={2}
            />

            <CommissionForm
                currentValue={gas ? gas?.toNumber() : 0}
                unit="gas"
                min={0}
                maxDigits={0}
                increaseWaitPeriod={raiseTimeout?.toNumber()}
                nextIncrease={timeoutTimestamp}
                maxRaise={maxRaise?.toNumber()}
                progress={progress}
                helperText="Commission is set as an amount of gas. This amount is converted to CTSI at the time of block production, by using a gas price from an oracle and a ETH/CTSI price from a price oracle."
                onSubmit={changeGas}
            />
        </>
    );
};

export default GasTaxContainer;
