// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useState } from 'react';
import {
    Alert,
    AlertDescription,
    Box,
    CloseButton,
    Spinner,
} from '@chakra-ui/react';
import { ContractTransaction } from 'ethers';
import CommissionForm from '../../components/stake/CommissionForm';
import { useFlatRateCommission } from '../../services/pool';

export interface FlatRateContainerProps {
    pool: string;
    onSuccess: (transaction: ContractTransaction) => void;
    onError: (error: string) => void;
}

const FlatRateContainer: FC<FlatRateContainerProps> = (props) => {
    const { pool, onSuccess, onError } = props;
    const {
        rate,
        maxRaise,
        timeoutTimestamp,
        raiseTimeout,
        changeRate,
        transaction,
    } = useFlatRateCommission(pool);
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
                onSubmit={(value) => {
                    setChangingRate(true);
                    changeRate(value * 100);
                }}
            />

            {isChangingRate &&
                !transaction?.acknowledged &&
                !transaction?.error &&
                progress === 0 && (
                    <Alert status="info" variant="left-accent" mt={2}>
                        <Spinner mx={2} />
                        <Box flex="1">
                            <AlertDescription display="block">
                                Updating pool commission...
                            </AlertDescription>
                        </Box>
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

export default FlatRateContainer;
