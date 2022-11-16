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
import { useGasTaxCommission } from '../../services/pool';

export interface GasTaxContainerProps {
    pool: string;
}

const GasTaxContainer: FC<GasTaxContainerProps> = (props) => {
    const { pool } = props;
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
            <TransactionFeedback transaction={transaction} />
            <CommissionForm
                currentValue={gas?.toNumber()}
                unit="gas"
                min={0}
                maxDigits={0}
                progress={progress}
                increaseWaitPeriod={raiseTimeout?.toNumber()}
                nextIncrease={timeoutTimestamp}
                maxRaise={maxRaise?.toNumber()}
                onSubmit={changeGas}
                helperText="Commission is set as an amount of gas. This amount is converted to CTSI at the time of block production, by using a gas price from an oracle and a ETH/CTSI price from a price oracle."
            />
        </>
    );
};

export default GasTaxContainer;
