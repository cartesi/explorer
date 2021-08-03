// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Button, Text, VStack } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import CTSIText from '../CTSIText';

export interface WithdrawFormProps {
    releasedBalance: BigNumber;
    withdrawBalance: BigNumber;
    onWithdraw: () => void;
}

const WithdrawForm: FC<WithdrawFormProps> = ({
    releasedBalance,
    withdrawBalance,
    onWithdraw,
}) => {
    // put in red if user has released balance but it's not yet available to withdraw
    const color =
        releasedBalance.gt(0) && withdrawBalance.isZero()
            ? 'red.500'
            : undefined;

    return (
        <VStack align="stretch" spacing={5}>
            <CTSIText value={withdrawBalance} color={color}>
                <Text color={color}>Withdraw Balance</Text>
            </CTSIText>
            <Button disabled={withdrawBalance.isZero()} onClick={onWithdraw}>
                Withdraw
            </Button>
        </VStack>
    );
};

export default WithdrawForm;
