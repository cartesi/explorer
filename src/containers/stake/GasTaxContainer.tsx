// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useState } from 'react';
import { ContractTransaction } from 'ethers';
import { Alert, CloseButton, Spinner } from '@chakra-ui/react';
import CommissionForm from '../../components/pools/fee/CommissionForm';
import { useGasTaxCommission } from '../../services/pool';

export interface GasTaxContainerProps {
    pool: string;
    onSuccess: (transaction: ContractTransaction) => void;
    onError: (error: string) => void;
}

const GasTaxContainer: FC<GasTaxContainerProps> = (props) => {
    const { pool, onSuccess, onError } = props;
    const {
        gas,
        maxRaise,
        timeoutTimestamp,
        raiseTimeout,
        changeGas,
        transaction,
    } = useGasTaxCommission(pool);
    const [isChangingRate, setChangingRate] = useState<boolean>(false);
    const progress = transaction?.receipt?.confirmations || 0;

    useEffect(() => {
        if (transaction?.error) {
            onError(transaction?.error);
        } else if (progress >= 1) {
            onSuccess(transaction?.transaction);
        }
    }, [transaction]);

    return (
        <>
            <CommissionForm
                currentValue={gas?.toNumber()}
                unit="gas"
                min={0}
                maxDigits={0}
                increaseWaitPeriod={raiseTimeout?.toNumber()}
                nextIncrease={timeoutTimestamp}
                maxRaise={maxRaise?.toNumber()}
                helperText="Commission is set as an amount of gas. This amount is converted to CTSI at the time of block production, by using a gas price from an oracle and a ETH/CTSI price from a price oracle."
                onSubmit={(value) => {
                    setChangingRate(true);
                    changeGas(value);
                }}
            />

            {isChangingRate &&
                !transaction?.acknowledged &&
                !transaction?.error &&
                progress === 0 && (
                    <Alert status="info" variant="left-accent" mt={2}>
                        <Spinner mx={2} />
                        <CloseButton
                            position="absolute"
                            right="8px"
                            top="8px"
                            onClick={() => {
                                setChangingRate(false);
                                transaction?.ack();
                            }}
                        />
                    </Alert>
                )}
        </>
    );
};

export default GasTaxContainer;
